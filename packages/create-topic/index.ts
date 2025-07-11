import { Command } from "commander";
import path from "path";
import process from "process";
import prompts from "prompts";
import { abort } from "./helpers/abort.js";
import { PackageJson } from "./helpers/package.js";
import { createProject } from "./helpers/project.js";
import { createReadme } from "./helpers/readme.js";
import { isKebabCase } from "./helpers/string.js";
import { copy } from "./helpers/copy.js";

try {
  let topicName = "";

  new Command()
    .argument("[topic]")
    .action((name) => (topicName = name?.trim() || topicName))
    .parse(process.argv);

  if (!topicName) {
    const { name } = await prompts({
      name: "name",
      type: "text",
      message: "what is topic's name?",
      initial: "topic-name",
      onState: (state: { aborted: boolean }) => {
        state.aborted && abort();
      },
    });

    topicName = name.trim() || topicName;
  }

  if (!topicName) {
    throw new Error("the topic name must be specified");
  }

  if (!isKebabCase(topicName)) {
    throw new Error("the topic name must be kebab-cased");
  }

  const projectDir = await createProject(topicName);

  const packageJson = new PackageJson(projectDir, topicName);
  await packageJson.create();
  await packageJson.install();

  await createReadme(projectDir, packageJson);

  const templateDir = path.resolve(import.meta.dirname, "../template");
  await copy(templateDir, projectDir);

  console.log("success to creating topic!");
} catch (e) {
  abort("failed to create topic", e);
}
