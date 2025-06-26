# [Topic 02] Auth.js (NextAuth v5)

Auth.js를 활용한 로그인 구현 샘플

## Tech Stack

- Node 18
- React 19
- Next.js 15
- NextAuth 5 (beta)

## Getting Started

```bash
pnpm install

pnpm dev # run server in development mode (http://localhost:3000)

# or
pnpm build # build the app
pnpm start # run server in production mode (http://localhost:3000)
```

### Before Started

로그인 기능을 사용하려면 `.env.local`에 아래 내용 추가 필요

```bash
# .env.local
AUTH_SECRET=your-secret-here # CLI에서 `npx auth secret` or `openssl rand -hex 32` 실행해 추가
AUTH_TRUST_HOST=true # production mode에서 테스트 하려면 추가 필요

# For GitHub OAuth authentication
# https://authjs.dev/guides/configuring-github
AUTH_GITHUB_ID=github-client-id-here
AUTH_GITHUB_SECRET=github-client-secret-here

# For Email authentication
# https://authjs.dev/getting-started/providers/nodemailer#configuration
EMAIL_SERVER=smtp-server-here
EMAIL_FROM=sender-email-here
```

## Auth.js

Auth.js는 표준 Web API 기반으로 만들어진 **runtime agnostic** 라이브러리(특정 런타임에 구애받지 않는 라이브러리)로, 기존 NextAuth와 달리 Next.js를 포함한 여러 프레임워크에서 사용할 수 있다.

### Comparison with v4

#### API

기존 라우트 핸들러(`GET`, `POST`)만 반환했던 NextAuth가 라우트 핸들러를 포함한 여러 서버 사이드 API를 반환한다.

```ts
// src/auth.ts
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...options
});
```

1. `handlers`
   라우트 핸들러용 API이다. 페이지 라우터를 포함해 `app/api/auth/[...nextauth]/route.ts`에 아래와 같이 코드를 추가해야 한다.

   ```ts
   // src/app/auth/[...nextauth]/route.ts
   import { handlers } from "@/auth";

   export const { GET, POST } = handlers;
   ```

2. `signIn()` / `signOut()`

   서버 사이드에서 로그인/로그아웃을 실행할 때 사용하는 함수이다. 이전 버전에서는 [클라이언트 컴포넌트에서 로그인을 구현](../01-next-auth/docs/custom-signin-page.md)해야 했지만, 이제 서버 컴포넌트에서도 로그인/로그아웃을 구현할 수 있다.

   ```tsx
   // src/app/signin/page.tsx
   import { signIn } from "@/auth";

   export default function SignInPage() {
     const action = async () => {
       "use server";
       await signIn("github");
     };

     return (
       <form action={action}>
         <button type="submit">Sign In with GitHub</button>
       </form>
     );
   }
   ```

3. `auth()`

   기존 `getServerSession()`, `withAuth()` 등 서버 사이드 API들이 `auth()`로 통일되었다.

   **AS IS**

   ```tsx
   import authOptions from "@/auth/options";
   import { getServerSession } from "next-auth";

   export default function Page() {
     const session = await getServerSession(authOptions);

     return <>Page</>;
   }
   ```

   **TO BE**

   ```tsx
   import { auth } from "@/auth";

   export default async function Page() {
     const session = await auth();

     return <>Page</>;
   }
   ```

#### Provider

1. OAuth
   - OAuth/OIDC를 구분할 수 있도록 `provider.type`에 `oidc`가 추가되었다.
   - OAuth 1.0 지원이 중단되었다.
2. Email
   - [HTTP 메일 프로바이더](https://authjs.dev/guides/configuring-http-email)가 추가되었다.
   - 기존 제공하던 SMTP 메일 프로바이더는 `Email`에서 `Nodemailer`로 변경되었다.
3. Credentials
   - 이전 버전과 동일하게 `database` 세션 전략에서 세션이 DB에 저장되지 않고 `jwt` 토큰으로 만들어지는 현상은 유지되었다. `database` 세션 전략을 이용하려면 [jwt 인코딩 함수의 기본 동작을 변경](../01-next-auth/docs/credentials-with-db.md)해야 한다.

#### Adapter

- `deleteUser()`, `unlinkAccount()` 함수가 추가되었으나, 아직 호출하지 않는다 ([관련 문서](https://authjs.dev/guides/creating-a-database-adapter))
