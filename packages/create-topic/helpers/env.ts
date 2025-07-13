import { writeFile } from "fs/promises";
import path from "path";

import { parseTopic } from "./project.js";

export async function createDotEnv(projectDir: string) {
  console.log("creating .env.local...");
  const [_, topicName] = parseTopic(projectDir);
  await writeFile(
    path.resolve(projectDir, ".env.local"),
    `APP_TITLE=${topicName}`
  );
}
