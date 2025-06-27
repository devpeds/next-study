declare namespace NodeJS {
  interface ProcessEnv {
    EMAIL_SERVER: string;
    EMAIL_FROM: string;
    ADAPTER_TYPE?: "prisma" | "in-memory";
  }
}
