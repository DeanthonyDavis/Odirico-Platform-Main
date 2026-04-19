import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env,
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`Build terminated by signal ${signal}.`));
        return;
      }

      resolve(code ?? 0);
    });
  });
}

function resolveNextBuildArgs(cwd) {
  const requireFromWorkspace = createRequire(path.join(cwd, "package.json"));

  try {
    return [requireFromWorkspace.resolve("next/dist/bin/next"), "build", "--webpack"];
  } catch (error) {
    throw new Error(
      `Unable to resolve the Next.js CLI for ${cwd}. Install workspace dependencies before building.`,
      { cause: error instanceof Error ? error : undefined },
    );
  }
}

async function main() {
  const cwd = process.cwd();
  const shouldUseNtfsMirror =
    process.platform === "win32" &&
    process.env.ODIRICO_BUILD_DIRECT !== "1" &&
    /^[A-Za-z]:\\/.test(cwd) &&
    path.parse(cwd).root.toUpperCase() !== "C:\\";

  const code = shouldUseNtfsMirror
    ? await run(
        "powershell.exe",
        ["-ExecutionPolicy", "Bypass", "-File", path.join(cwd, "scripts", "build-on-ntfs.ps1")],
        process.env,
      )
    : await run(process.execPath, resolveNextBuildArgs(cwd), process.env);

  process.exit(code);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
