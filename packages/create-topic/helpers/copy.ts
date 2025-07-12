import { copyFile, mkdir, readdir, stat } from "fs/promises";
import path from "path";

export async function copy(sourceDir: string, targetDir: string) {
  console.log(`copying ${sourceDir}...`);
  await mkdir(targetDir, { recursive: true });

  const items = await readdir(sourceDir);
  for (const item of items) {
    const itemSourcePath = path.resolve(sourceDir, item);
    const itemTargetPath = path.resolve(targetDir, item);

    if ((await stat(itemSourcePath)).isDirectory()) {
      await copy(itemSourcePath, itemTargetPath);
    } else {
      await copyFile(itemSourcePath, itemTargetPath);
    }
  }
}
