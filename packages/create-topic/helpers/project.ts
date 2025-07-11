import { mkdir, readdir, stat } from "fs/promises";
import path from "path";

const REGEX_TOPIC_DIR = /^\d+-(\w+-)*\w+$/;

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
        } catch (e) {
          return undefined;
        }
      })
    )
  ).filter((dir) => !!dir && REGEX_TOPIC_DIR.test(dir));

  return `${topics.length + 1}`.padStart(2, "0");
}

export async function createProject(topicName: string) {
  console.log("creating project directory...");
  const topicsDir = path.resolve(process.cwd(), "topics");
  const nextTopic = await getNextTopicNumber(topicsDir);
  const projectDir = path.resolve(topicsDir, `${nextTopic}-${topicName}`);

  await mkdir(projectDir);

  return projectDir;
}
