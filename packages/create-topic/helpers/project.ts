import { appendFile, mkdir, readdir, stat } from "fs/promises";
import path from "path";

const REGEX_TOPIC_DIR = /^(\d+)-((?:\w+-)*\w+)$/;

async function getNextTopicNumber(topicsDir: string) {
  const stats = await stat(topicsDir);
  if (!stats.isDirectory()) {
    throw new Error(`${topicsDir} is not a directory`);
  }

  const topics = (
    await Promise.all(
      (
        await readdir(topicsDir)
      ).map(async (topic) => {
        const dir = path.resolve(topicsDir, topic);
        try {
          const stats = await stat(dir);
          if (!stats.isDirectory()) {
            return undefined;
          }

          return topic;
        } catch {
          return undefined;
        }
      })
    )
  ).filter((dir) => !!dir && REGEX_TOPIC_DIR.test(dir));

  return `${topics.length + 1}`.padStart(2, "0");
}

export function parseTopic(projectDir: string) {
  const arr = projectDir.split("/");
  const dirname = arr[arr.length - 1];
  const results = dirname.match(REGEX_TOPIC_DIR);

  if (!results) {
    throw new Error("failed to parsing topic:" + dirname);
  }

  return [results[1], results[2]] as const;
}

export async function createProject(topicName: string, rootDirectory: string) {
  console.log("creating project directory...");
  const topicsDir = path.resolve(rootDirectory, "topics");
  const nextTopic = await getNextTopicNumber(topicsDir);
  const dirname = `${nextTopic}-${topicName}`;
  const projectDir = path.resolve(topicsDir, dirname);

  await mkdir(projectDir);
  await appendFile(
    path.resolve(rootDirectory, "README.md"),
    `- [${dirname}](./topics/${dirname})\n`
  );

  return projectDir;
}
