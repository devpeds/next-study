import { writeFile } from "fs/promises";
import path from "path";

import { spawnAsync } from "./command.js";

export class PackageJson {
  constructor(projectDir: string, topicName: string) {
    this.projectDir = projectDir;
    this.packageJson = {
      name: `@topic/${topicName}`,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        "@shared/ui": "workspace:*",
        next: "^15.3.5",
        react: "^19.1.0",
        "react-dom": "^19.1.0",
      },
      devDependencies: {
        "@shared/eslint-config": "workspace:*",
        "@shared/ts-config": "workspace:*",
        "@tailwindcss/postcss": "^4.1.11",
        "@types/node": "^24.0.13",
        "@types/react": "^19.1.8",
        "@types/react-dom": "^19.1.6",
        eslint: "^9.30.1",
        tailwindcss: "^4.1.11",
        typescript: "^5.8.3",
      },
    };
  }

  private projectDir: string;
  private packageJson: Record<string, unknown>;

  get dependencies() {
    return this.packageJson["dependencies"] as Record<string, string>;
  }

  async create() {
    console.log("creating package.json...");
    await writeFile(
      path.resolve(this.projectDir, "package.json"),
      JSON.stringify(this.packageJson, null, 2) + "\n",
    );
  }

  async install() {
    console.log("installing packages...");
    await spawnAsync("pnpm", { args: ["install"], cwd: this.projectDir });
  }
}
