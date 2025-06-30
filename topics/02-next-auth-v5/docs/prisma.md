# Prisma 연동

WebAuthn 인증 구현을 위해 [패스키 프로바이더를 추가](./webauthn.md)하면서 서버가 리로딩될 때마다 데이터가 삭제되는 인메모리 데이터베이스로 개발이 불편해 Prisma를 적용했다.

## Prisma

Prisma는 TypeScript 환경에서 사용되는 ORM(Object-Relational Mapping) 라이브러리다. ORM은 객체와 관계형 데이터베이스를 매핑해, 개발자가 코드 레벨에서 쉽게 데이터베이스를 다룰 수 있도록 도와준다. 이와 비슷하게 MongoDB 같은 NoSQL 데이터베이스를 객체를 매핑하는 ODM(Object-Document Mapping)도 있는데, Prisma는 MongoDB와의 연동도 가능하다.

[Prisma 공식문서](https://www.prisma.io/docs/orm/overview/prisma-in-your-stack/is-prisma-an-orm)에 따르면, Prisma는 전통적인 ORM이 아닌 **next-generation ORM**이라 소개한다. 전통적인 ORM과 비교해 Prisma는 다음과 같은 차이점이 있다.

**기존 ORM(TypeORM)**

- 데이터 모델과 매퍼를 클래스로 구현. 객체와 DB 테이블간 구조적 차이(object-relational impedance mismatch)로 인한 여러 문제 발생
  - 객체 그래프가 복잡할수록 매핑이 어려워짐
  - 상속, 중첩, 다형성 등 객체 지향 개념을 관계형 구조로 표현하기 까다로움
  - 두 간극을 줄이기 위해 API가 커지는 경향이 있고, 결과적으로 라이브러리에 대한 학습량 많아짐
- 객체-테이블간 동기화가 자동화되지 않아 스키마 변경시 코드와 DB 모두 수동으로 맞쳐야 함

**Prisma**

- **Prisma schema**를 기준으로 데이터 모델과 매퍼를 객체 대신 타입과 함수로 생성해 복잡도 감소
- Prisma schema를 기준으로 DB 마이그레이션을 진행해 코드-DB간 동기화가 쉬움

### 주요 구성 요소

- Prisma Schema

  Prisma의 핵심 구성 파일로, 객체/DB 스키마에 대한 단일 진실 공급원(Single Source of Truth)

- Prisma Client

  Prisma Schema를 기준으로 자동 생성되는 Type-safe 데이터베이스 클라이언트. 코드 레벨에서 데이터베이스에 대한 CRUD를 수행할 수 있다.

- Prisma Migrate

  Prisma Schema를 기준으로 객체/DB 스키마 동기화를 관리하는 도구.

- Prisma Studio

  웹 기반 GUI 어플리케이션. 데이터베이스 내 데이터를 관리하는 기능을 제공한다.

## Prisma 적용하기

Auth.js는 Prisma와의 쉬운 연동을 위한 어댑터를 별도의 [패키지](https://authjs.dev/getting-started/adapters/prisma)로 제공한다.

### Prisma 설정

우선, 필요한 패키지를 설치한다.

```bash
pnpm add -D prisma
pnpm add @prisma/client @auth/prisma-adapter
```

패키지 설치 후 prisma 설정을 위한 커맨드를 입력한다.

```bash
pnpm exec prisma init --datasource-provider=sqlite
```

데이터베이스는 개발용으로 SQLite를 사용했다. `prisma init` 커맨드 옵션 중에 `--output` 옵션이 있는데, 해당 옵션을 사용하면 `node_modules/.prisma/client` 대신 지정한 위치에 Prisma Client가 생성된다.

커맨드를 생성하면 프로젝트 루트에 `prisma/schema.prisma` 파일이 생성된다.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 스키마 정의 & 마이그레이션

Auth.js 공식 문서에 있는 [스키마](https://authjs.dev/getting-started/adapters/prisma#schema)를 `prisma/schema.prisma` 파일에 추가 후 마이그레이션을 진행한다. 마이그레이션을 실행하기 전 `.env` 파일에 환경 변수 `DATA_URL`이 명시되어 있어야 한다.

```bash
pnpm exec prisma migrate dev
```

마이그레이션이 끝나면 데이터베이스 스키마와 Prisma Client가 갱신된다.

### 코드 작성

성능을 위해 앱 전체가 하나의 인스턴스만 사용할 수 있도록 아래와 같이 코드를 작성한다.

```ts
// prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

> **Note**
>
> Prisma Schema에 클라이언트 생성 경로(`output`)를 기본값과 다르게 설정했다면,>`"@prisma/client"`가 아닌 클라이언트가 생성된 경로에서 모듈을 가져와야 한다.

생성한 `prisma` 인스턴스를 이용해 `PrismaAdapter`를 NextAuth 옵션에 추가한다.

```ts
// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ...other options
});
```

## Credentials 인증

Credentials 인증을 하려면 비밀번호가 필요한데, 현재 User 모델에 비밀번호를 저장할 필드가 없어 스키마 수정이 필요하다.

```prisma
// prisma/schema.prisma

model User {
  // ...other fields
  // Optional for Credentials support
  password      String?
}
```

스키마를 수정을 끝냈으면, 마이그레이션을 진행한다.

```bash
pnpm exec prisma migrate dev
```

마이그레이션 후, 회원가입시 클라이언트 또는 어댑터를 이용해 사용자를 생성한다. 어댑터를 사용할 경우 Module Augmentation을 통해 `AdapterUser` 타입을 수정해야 타입 에러를 해결할 수 있다.

```ts
// module augmentation
import {
  AdapterUser as OriginalAdapterUser,
  Adapter as OriginalAdapter,
} from "next-auth/adapters";

declare module "next-auth/adapters" {
  interface AdapterUser extends OriginalAdapterUser {
    password?: string;
  }

  interface Adapter extends OriginalAdapter {
    createUser?(
      user: Omit<AdapterUser, "id"> & { id?: string }
    ): Awaitable<AdapterUser>;
  }
}

// sign up
import { adapter } from "@/auth";

async function signUp(data: { email: string; password: string }) {
  // ...handle logic
  await adapter.createUser?.({ email, password });
}
```

## References

- [Auth.js 공식 문서](https://authjs.dev/getting-started/adapters/prisma)
- [Prisma 공식 문서](https://www.prisma.io/docs/)
