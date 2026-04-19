import { spawn } from "node:child_process";
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

async function runNode(scriptPath, scriptArgs, env) {
  return run(process.execPath, [scriptPath, ...scriptArgs], env);
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
    : await runNode(path.join(cwd, "node_modules", "typescript", "bin", "tsc"), [], process.env);

  if (!shouldUseNtfsMirror && code === 0) {
    const viteCode = await runNode(
      path.join(cwd, "node_modules", "vite", "bin", "vite.js"),
      ["build"],
      process.env,
    );
    process.exit(viteCode);
  }

  process.exit(code);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
