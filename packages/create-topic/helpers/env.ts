import { writeFile } from "fs/promises";
import { parseTopic } from "./project.js";
import path from "path";

export async function createDotEnv(projectDir: string) {
  console.log("creating .env.local...");
  const [_, topicName] = parseTopic(projectDir);
  await writeFile(
    path.resolve(projectDir, ".env.local"),
    `APP_TITLE=${topicName}`
  );
}
