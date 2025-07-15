import process from "process";

function parseSemver(semver: string) {
  const results = semver.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!results) {
    throw new Error(`failed to parsing semver: ${semver}`);
  }

  return [results[1], results[2], results[3]].map((v) => Number(v));
}

export const nodeVersion = () => process.versions.node;
export const reactVersion = () => "19.1.0";
export const nextVersion = () => "15.3.5";
export const majorVersion = (semver: string) => parseSemver(semver)[0];
