import { spawn } from "child_process";

export async function spawnAsync(
  command: string,
  { args = [], cwd }: { args?: string[]; cwd: string },
) {
  return new Promise<void>((resolve, reject) => {
    spawn(command, args, { cwd }).on("close", (code) => {
      if (code !== 0) {
        const data = { code, command, args };
        return reject(`command failed. ${JSON.stringify(data, null, 2)}`);
      }

      resolve();
    });
  });
}
