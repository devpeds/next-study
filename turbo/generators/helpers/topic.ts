import path from "path";
import { isTopicPathName } from "./string";
import { readdirSync, statSync } from "fs";

export function getTopicNumber(topicsDir: string) {
  const topics = readdirSync(topicsDir).map((topic) => {
    try {
      if (!isTopicPathName(topic)) {
        return undefined;
      }

      const dir = path.resolve(topicsDir, topic);
      if (!statSync(dir).isDirectory()) {
        return undefined;
      }

      return topic;
    } catch {
      return undefined;
    }
  });

  const count = topics.filter((v) => !!v).length;
  return `${count + 1}`.padStart(2, "0");
}
