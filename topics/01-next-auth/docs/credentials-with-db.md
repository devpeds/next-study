# `database` 세션 관리 기반 Credentials 인증

규모가 있는 웹 서비스에서는 사용자 및 인증 관리를 백엔드 서버에서 따로 관리할 확률이 높다. 하지만 토이 프로젝트나 소규모의 서비스를 만든다면 DB를 next.js 서버에 직접 연결한 2-티어 아키텍쳐를 채용하는 것이 효율적일 수 있다. 또한 소셜 로그인, 매직링크 등의 인증 방식이 널리 사용 되면서 아이디(혹은 이메일)/패스워드를 입력받는 Credentials 인증을 많이 사용하지 않는 추세다. 하지만 필요한 경우를 대비해, 2-티어 아키텍쳐에서 아이디/패스워드 인증을 구현하는 방법과 `database` 세션 전략 사용시 발생할 문제 상황과 해결 방법을 소개하고자 한다.

## 준비하기

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";

const adapter: Adapter = { /** 1. implement adapter */ }

const handler = NextAuth({
  adapter,
  session: {
    strategy: "database", // 2. set session strategy to "database"
  },
  providers: [
    // 3. add credentials provider
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password", placeholder: "Password" },
        authorize: async (credentials) => {
          const user = await adapter?.getUserByEmail?.(credentials.email);
          if (!user) {
            return null;
          }

          return credentials.password === user.password ? user : null;
        }
      },
    }),
  ],
});

export default { handler as GET, handler as POST };
```

1. Adapter를 준비한다. next-auth에서는 Prisma, Firebase, DynamoDB 등 다양한 빌트인 어댑터를 제공한다. 필자의 경우 간단한 인메모리 데이터베이스([코드](../src/db.ts))를 만들고 커스텀 어댑터([코드](../src/auth/adapter.ts))를 구현해서 사용했다.
2. 준비한 어탭터를 NextAuth 설정에 추가하고, `session.strategy`를 `database`로 설정한다. 어댑터를 추가하지 않은 채 `database`로 설정할 경우 오류가 발생한다.
3. `providers`에 Credentials Provider를 아래 인자를 넘겨주며 추가한다.
   - `credentials`: 인증에 사용할 필드를 정의하며, 각각 `<input>` 요소의 속성을 설정한다.
   - `authorize()`: 입력된 값으로 사용자를 검증하는 함수이다. 인증에 성공하면 사용자 객체를 반환하고, 실패 시 `null`을 반환한다.

NextAuth 설정과 별개로 [회원가입 페이지](../src/app/signup/page.tsx)를 만들어 계정을 생성할 수 있도록 했다.

## 문제상황

위와 같이 설정 후 인증을 시도하면, 세션 정보와 토큰이 생성되지 않고 이전 페이지로 리디렉션되는 현상이 발생했다. 반면, 세션 전략을 `jwt`로 변경하거나 `database`로 유지하되 다른 로그인 방식을 사용할 경우 해당 현상이 재현되지 않고 정상적으로 로그인할 수 있었다.

## 원인파악

원인 파악을 위해 소스 코드 분석을 해보니 credentials 인증은 다른 인증과 달리, 인증 성공 이후 **[session strategy 상관없이 JWT를 인코딩](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/core/routes/callback.ts#L327-L423)**해 쿠키를 저장 후 리디렉션을 수행했다. 그리고 이후 세션을 가져올 때 DB에 JWT 토큰을 키로 가지는 세션이 없다보니 [세션 쿠키가 브라우저에서 삭제](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/core/routes/session.ts#L180-L184)되는 현상이 발생했다.

공식 문서에서 [`CredentialsProvider` 사용을 지양할 의도로 제한된 기능을 제공한다고 명시](https://next-auth.js.org/providers/credentials)되어 있는데, 아마 해당 현상도 개발자의 의도가 아닐까 짐작한다.

## 해결하기

`database` 전략에서도 JWT 대신 세션 토큰을 사용할 수 있도록 아래와 같이 수정해 해결했다.

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { SessionOptions } from "next-auth";

const COOKIE_SESSION_TOKEN = "next-auth.session-token";

const session: SessionOptions = {
  strategy: "database",
  maxAge: 2592000, // 30 days in seconds (default value)
  updateAge: 86400, // 1 day in seconds (default value)
  generateSessionToken: () => randomUUID(),
};

const handler = NextAuth({
  // adapter, providers, ...
  session,
  callbacks: {
    jwt: async ({ token, user: { id: userId }, account }) => {
      // 1. If credentials sign in, create session token
      if (account?.type === "credentials") {
        const sessionToken = await sessionOptions.generateSessionToken();
        const expires = new Date(Date.now() + sessionOptions.maxAge * 1000);

        await adapter.createSession?.({ sessionToken, userId, expires });
        (await cookies()).set(COOKIE_SESSION_TOKEN, sessionToken, {
          expires,
        });
      }
      return token;
    },
  },
  jwt: {
    // 2. Overwrite default jwt.encode() function
    encode: async () => {
      return (await cookies()).get(COOKIE_SESSION_TOKEN)?.value ?? "";
    },
  }
});

export default { handler as GET, handler as POST };
```

1. 세션 및 토큰을 생성하고 토큰을 쿠키에 저장하는 로직을 `callbacks.signIn` 혹은 `callbacks.jwt`에 추가한다. 많은 레퍼런스에서 `callbacks.signIn`을 사용하지만, `database` 전략임에도 JWT 인코딩을 수행한다는 의미가 잘 전달될 수 있도록 `callbacks.jwt`을 사용했다.
2. JWT 인코딩 대신 쿠키에 저장된 세션 토큰을 반환하도록 `jwt.encode` 함수를 오버라이딩한다.

## Reference

- [https://github.com/nextauthjs/next-auth/discussions/4394](https://github.com/nextauthjs/next-auth/discussions/4394)
- [https://nneko.branche.online/next-auth-credentials-provider-with-the-database-session-strategy/](https://nneko.branche.online/next-auth-credentials-provider-with-the-database-session-strategy/)
- [https://www.youtube.com/watch?v=rZ-WNsxu17s](https://www.youtube.com/watch?v=rZ-WNsxu17s)
