import path from "path";
import { PlopTypes } from "@turbo/gen";
import { isKebabCase } from "./helpers/string";
import { getTopicNumber } from "./helpers/topic";
import {
  majorVersion,
  nextVersion,
  nodeVersion,
  reactVersion,
} from "./helpers/semver";
import { spawnAsync } from "./helpers/command";
import { appendFile } from "fs/promises";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  const rootPath = plop.getDestBasePath();

  const topicNumber = getTopicNumber(path.resolve(rootPath, "topics"));

  plop.setHelper("topicNumber", () => topicNumber);
  plop.setHelper("nodeVersion", nodeVersion);
  plop.setHelper("reactVersion", reactVersion);
  plop.setHelper("nextVersion", nextVersion);
  plop.setHelper("majorVersion", majorVersion);

  plop.setGenerator("topic", {
    description:
      "Topic generator - creates a new Next.js app on `/topics` directory",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the topic?",
        validate: (input: string) => {
          if (!input) {
            return "Topic name is required";
          }

          if (!isKebabCase(input)) {
            return "Topic name must be kebab-cased (e.g., my-topic)";
          }

          return true;
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination:
          "{{ turbo.paths.root }}/topics/{{ topicNumber }}-{{ name }}",
        base: "templates",
        templateFiles: "templates/**/*",
      },
      async (data) => {
        const topicPath = `${topicNumber}-${data["name"]}`;
        const cwd = path.resolve(rootPath, `topics/${topicPath}`);
        return await spawnAsync("pnpm", { args: ["install"], cwd });
      },
      // NOTE: "append" type의 Built-in 액션이 있지만, [, ] 등 특정 문자가
      // 템플릿에 포함된 경우 invalid regex 에러가 발생하면서 실패하는 이슈가 있음
      // https://github.com/plopjs/plop/issues/462
      async (data) => {
        const topicPath = `${topicNumber}-${data["name"]}`;
        await appendFile(
          path.resolve(rootPath, "README.md"),
          `- [${topicPath}](./topics/${topicPath})\n`,
        );
        return `${topicPath} is appended on /README.md`;
      },
    ],
  });
}
