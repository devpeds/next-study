# 커스텀 로그인 페이지

NextAuth는 기본적으로 [빌트인 로그인 페이지](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/core/pages/signin.tsx)를 제공한다. `theme` 옵션을 통해 페이지를 어느 정도 커스터마이징 할 수 있지만, 전체적인 UI나 레이아웃을 변경하려면 로그인 페이지를 따로 만들어야 한다. 메타 태그 수정이나 i18n 적용 역시 어렵기 때문에 실무에서는 내부용 사이트가 아닌 이상 커스텀 로그인 페이지를 만들지 않을까 생각한다.

커스텀 페이지를 만들면 아래와 같이 `pages.signIn` 옵션에 만들어둔 로그인 페이지의 경로를 연결하면 `GET api/auth/login` 요청시 커스텀 로그인 페이지로 리다이렉트 된다.

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";

const handler = NextAuth({
  // ...AuthOptions
  pages: {
    signIn: 'signin', // app/signin/page.tsx와 연동
  }
});

export default { handler as GET, handler as POST };
```

NextAuth에 연결하지 않으면 커스텀 페이지와 빌트인 페이지가 두 개 존재하게 된다. 이 경우 개발자의 의도와 달리 사용자는 기본 페이지로 리디렉션될 수 있어 사용자 경험 측면에서 바람직하지 않다. 따라서 되도록 커스텀 페이지를 연결하는 것을 추천한다.

## RSC로 로그인 페이지 만들기

빌트인 로그인 페이지의 [소스코드](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/core/pages/signin.tsx)를 봤을때 서버 컴포넌트로만 로그인 페이지를 만들 수 있다고 판단했으나, 결론적으로 RSC만 가지고 로그인 페이지를 만들 수 없었다.

### 문제상황

처음 페이지를 만들 때 빌트인 페이지와 동일한 방식으로 구현했다.

```tsx
// app/signin/page.tsx
import { getCsrfToken } from "next-auth/react";

export default async function SignInPage() {
  const csrfToken = await getCsrfToken();

  return (
    <form method="POST" action="api/auth/signin/github">
      <input hidden readOnly name="csrfToken" value={csrfToken}>
      <button type="submit">Sign in with GitHub</button>
    </form>
  );
}
```

1. 서버 컴포넌트에서 `getCsrfToken()`을 사용해 CSRF 토큰을 가져온다.
2. 폼의 `action` 속성에는 NextAuth가 제공하는 소셜 로그인 엔드포인트를 지정한다.
3. 가져온 토큰을 `<input>` 요소에 설정하여, 폼 제출 시 요청 본문에 포함되도록 한다.

위 코드는 논리적으로 문제가 없는 것 처럼 보였지만, 실제 실행 했을때, 로그인이 되지 않고 로그인 페이지로 리디렉션 되는 현상이 발생했다.

### 원인파악

원인을 파악하기 위해 NextAuth의 소스 코드를 확인했다. NextAuth의 전체적인 흐름은 다음과 같았다.

1. `/api/auth`로 시작하는 모든 엔드포인트에 대한 요청이 들어오면 CSRF 토큰을 생성한다. ([코드](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/core/lib/csrf-token.ts))
   - 쿠키에 CSRF 토큰이 있다면, 쿠키에 있는 토큰을 사용하고 토큰에 대한 유효성(`isCsrfVerified`)도 같이 검증한다.
   - 쿠키에 토큰이 없다면, CSRF 토큰을 새로 생성한다.
2. 각 요청은 매핑된 함수를 실행한다. 이 때 POST 요청의 경우 CSRF 토큰 검증에 실패할 경우 로그인/로그아웃 페이지로 리다이렉트 시킨다. ([코드](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/core/index.ts#L267))

위와 같은 플로우에서 RSC로 만든 로그인 폼은 토큰 유효성에 실패해 로그인 페이지로 리디렉션 되는 것이었다. 처음에는 유횽성 검사 실패가 요청 페이로드를 직렬화하는 과정에서 토큰이 빠져서 발생한 것으로 의심했지만, 실제 페이로드와 쿠키에 있는 토큰 값이 서로 달라서 발생한 문제였다. 이에 대한 원인을 분석해보니 다음과 같았다.

1. `getCsrfToken()`은 REST API(`GET api/auth/csrf`)를 통해 쿠키에 저장된 토큰을 내려주거나 새로운 토큰을 생성해 내려준다.
2. RSC는 서버 위에서 실행되기 때문에 RSC 내부에서 `getCsrfToken()`을 호출하면 브라우저가 아닌 서버에서 REST API를 호출한다.
3. 서버에서 API를 호출했기 때문에 토큰을 새로 생성해 내려줄 것이며, 로그인 폼에서 들어간 토큰은 새로 생성된 토큰이 들어가기 때문에 쿠키에 저장된 토큰과 값이 다르다.

### 해결하기

CSRF 토큰이 달라지는 원인을 해결하기 위해 몇 가지 방법을 시도해 보았다.

#### 시도 1. `signIn()` API 사용하기 - ✅

가장 간단한 방법은 `next-auth/react`의 `signIn()` 함수를 사용하는 방법이었다.

```tsx
"use client";

import { signIn } from "next-auth/react";

export default function SignInButton(props: { callbackUrl?: string }) {
  return (
    <button onClick={() => signIn("github", { callbackUrl })}>
      Sign In With GitHub
    </button>
  );
}
```

`signIn()`함수를 사용하면 내부적으로 `getCsrfToken()`을 호출하기 때문에 CSRF 토큰에 대해 신경쓰지 않아도 된다. 주의할 점은 로그인 성공 후 `signIn()` 함수를 호출한 로그인 페이지로 리디렉션이 되지 않도록, callbackUrl을 넘겨줘야 한다.

#### 시도 2. RSC에서 쿠키를 사용해 CSRF 토큰 가져오기 - ❌

두 번째로 시도한 방법은 `next/headers`의 `cookies` 모듈을 이용해 RSC에서 처리하는 방법이었다.

```tsx
import { cookies } from "next/headers";

export default async function SignInPage() {
  const csrfToken = (await cookies()).get("next-auth.csrf-token").value;

  return (
    <form method="POST" action="api/auth/signin/github">
      <input hidden readOnly name="csrfToken" value={csrfToken}>
      <button type="submit">Sign in with GitHub</button>
    </form>
  );
}
```

대부분의 케이스에서 잘 동작하지만, 다음의 상황에선 csrfToken을 가져올 수 없어 로그인에 실패한다.

1. 사이트를 방문해 본 적 없는 사용자가 검색창에 로그인 페이지 주소(`/signin`)를 입력해 페이지 요청.
2. `GET api/auth/signin`에서 리디렉션 없이 바로 로그인 페이지를 요청 했으므로 요청 헤더에 쿠키가 없음.
3. 요청 헤더에 쿠키가 없으므로 RSC에서는 빈 CSRF 토큰을 입력 폼에 추가.
4. 로그인 요청시 CSRF 토큰 검증에 실패했으므로 로그인 페이지로 리디렉션
   - 첫 로그인 실패 이후에는 요청 헤더에 쿠키가 포함되어 있으므로 로그인 성공

#### 시도 3. 클라이언트 사이드에서 CSRF 토큰 가져오기 - ⚠️

클라이언트 컴포넌트라면 `signIn()`를 사용하지 않더라도 `getCsrfToken()`으로 토큰을 직접 가져와 폼에 넣는 방법도 가능하다.

```tsx
"use client";

import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [csrfToken, setCsrfToken] = useState<string>();

  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  return (
    <form method="POST" action="api/auth/signin/github">
      <input hidden readOnly name="csrfToken" value={csrfToken}>
      <button type="submit" disabled={Boolean(csrfToken)}>
        Sign in with GitHub
      </button>
    </form>
  );
}
```

`use()`와 `<Suspense>`를 조합하거나 Context API를 이용해 CSRF 토큰을 전역 상태로 관리하는 등 다양한 방법으로 코드를 작성할 수 있지만, 공통적으로 토큰을 가져올 때까지 로그인 버튼을 비활성화 시켜야한다는 점에서 `signIn()`을 사용하는 방법이 더 좋다고 생각한다.
