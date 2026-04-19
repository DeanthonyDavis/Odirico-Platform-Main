import fs from "node:fs/promises";
import os from "node:os";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const BASE_RELEASE_CONFIG_PATH = path.join("src-tauri", "tauri.windows.release.conf.json");
const VALID_SIGNING_MODES = new Set(["signtool-pfx", "signtool-store", "trusted-signing-cli"]);

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
        reject(new Error(`Release build terminated by signal ${signal}.`));
        return;
      }

      resolve(code ?? 0);
    });
  });
}

function runCapture(command, args, env) {
  return new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];

    const child = spawn(command, args, {
      cwd: process.cwd(),
      env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
      stderr.push(chunk);
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`Command terminated by signal ${signal}.`));
        return;
      }

      resolve({
        code: code ?? 0,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
      });
    });
  });
}

function requireEnv(name, helpText) {
  if (!process.env[name]) {
    throw new Error(`${name} is required. ${helpText}`);
  }

  return process.env[name];
}

function validateSigningEnvironment({ allowUnsigned }) {
  if (allowUnsigned) {
    return;
  }

  const mode = process.env.ODIRICO_WINDOWS_SIGNING_MODE;

  if (!mode) {
    throw new Error(
      [
        "ODIRICO_WINDOWS_SIGNING_MODE is required for release:windows.",
        "Set it to signtool-pfx, signtool-store, or trusted-signing-cli.",
        "Use release:windows:unsigned only for local smoke tests.",
      ].join(" "),
    );
  }

  if (!VALID_SIGNING_MODES.has(mode)) {
    throw new Error(
      `Unsupported ODIRICO_WINDOWS_SIGNING_MODE "${mode}". Expected one of ${Array.from(VALID_SIGNING_MODES).join(", ")}.`,
    );
  }

  if (mode === "signtool-pfx") {
    requireEnv(
      "ODIRICO_WINDOWS_CERTIFICATE_PATH",
      "Point this to a .pfx code-signing certificate available on the build machine.",
    );
    requireEnv(
      "ODIRICO_WINDOWS_CERTIFICATE_PASSWORD",
      "Provide the password that unlocks the .pfx certificate.",
    );
    requireEnv(
      "ODIRICO_WINDOWS_TIMESTAMP_URL",
      "Provide your certificate authority or RFC 3161 timestamp service URL.",
    );
    return;
  }

  if (mode === "signtool-store") {
    requireEnv(
      "ODIRICO_WINDOWS_CERTIFICATE_THUMBPRINT",
      "Provide the SHA-1 thumbprint of the certificate already imported into the Windows certificate store.",
    );
    requireEnv(
      "ODIRICO_WINDOWS_TIMESTAMP_URL",
      "Provide your certificate authority or RFC 3161 timestamp service URL.",
    );
    return;
  }

  requireEnv(
    "ODIRICO_WINDOWS_TRUSTED_SIGNING_ENDPOINT",
    "Provide the Azure Trusted Signing endpoint.",
  );
  requireEnv(
    "ODIRICO_WINDOWS_TRUSTED_SIGNING_ACCOUNT",
    "Provide the Azure Trusted Signing account name.",
  );
  requireEnv(
    "ODIRICO_WINDOWS_TRUSTED_SIGNING_PROFILE",
    "Provide the Azure Trusted Signing certificate profile name.",
  );
}

function mergeObjects(base, overlay) {
  if (Array.isArray(base) || Array.isArray(overlay)) {
    return overlay;
  }

  if (!base || typeof base !== "object") {
    return overlay;
  }

  const result = { ...base };

  for (const [key, value] of Object.entries(overlay)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      result[key] = mergeObjects(result[key], value);
      continue;
    }

    result[key] = value;
  }

  return result;
}

async function importPfxCertificateToStore() {
  const certificatePath = path.resolve(
    requireEnv(
      "ODIRICO_WINDOWS_CERTIFICATE_PATH",
      "Point this to a .pfx code-signing certificate available on the build machine.",
    ),
  );
  const password = requireEnv(
    "ODIRICO_WINDOWS_CERTIFICATE_PASSWORD",
    "Provide the password that unlocks the .pfx certificate.",
  );
  const storeName = process.env.ODIRICO_WINDOWS_CERTIFICATE_STORE || "My";
  const storeLocation = process.env.ODIRICO_WINDOWS_CERTIFICATE_STORE_LOCATION || "CurrentUser";
  const storePath = `Cert:\\${storeLocation}\\${storeName}`;
  const scriptPath = path.join(process.cwd(), "scripts", "import-pfx-to-store.ps1");

  const result = await runCapture(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      scriptPath,
      "-CertificatePath",
      certificatePath,
      "-Password",
      password,
      "-StorePath",
      storePath,
    ],
    process.env,
  );

  if (result.code !== 0) {
    throw new Error("Importing the Windows .pfx certificate into the certificate store failed.");
  }

  const thumbprint = result.stdout
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  if (!thumbprint) {
    throw new Error("The imported Windows certificate thumbprint was not returned.");
  }

  return thumbprint;
}

async function buildReleaseConfig({ allowUnsigned }) {
  const baseConfigPath = path.join(process.cwd(), BASE_RELEASE_CONFIG_PATH);
  const baseConfig = JSON.parse(await fs.readFile(baseConfigPath, "utf8"));

  if (allowUnsigned) {
    return baseConfig;
  }

  const signingMode = process.env.ODIRICO_WINDOWS_SIGNING_MODE;
  const digestAlgorithm = process.env.ODIRICO_WINDOWS_DIGEST_ALGORITHM || "sha256";

  if (signingMode === "signtool-pfx") {
    const thumbprint = await importPfxCertificateToStore();

    return mergeObjects(baseConfig, {
      bundle: {
        windows: {
          certificateThumbprint: thumbprint,
          digestAlgorithm,
          timestampUrl: process.env.ODIRICO_WINDOWS_TIMESTAMP_URL,
          tsp: process.env.ODIRICO_WINDOWS_TIMESTAMP_USES_TSP === "1",
        },
      },
    });
  }

  if (signingMode === "signtool-store") {
    return mergeObjects(baseConfig, {
      bundle: {
        windows: {
          certificateThumbprint: process.env.ODIRICO_WINDOWS_CERTIFICATE_THUMBPRINT,
          digestAlgorithm,
          timestampUrl: process.env.ODIRICO_WINDOWS_TIMESTAMP_URL,
          tsp: process.env.ODIRICO_WINDOWS_TIMESTAMP_USES_TSP === "1",
        },
      },
    });
  }

  return mergeObjects(baseConfig, {
    bundle: {
      windows: {
        signCommand: {
          cmd: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
          args: [
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            "./src-tauri/windows/sign-windows.ps1",
            "%1",
          ],
        },
      },
    },
  });
}

async function main() {
  const allowUnsigned = process.argv.includes("--allow-unsigned");

  validateSigningEnvironment({ allowUnsigned });

  const releaseConfig = await buildReleaseConfig({ allowUnsigned });
  const tempConfigPath = path.join(
    os.tmpdir(),
    `odirico-desktop-tauri-release-${Date.now()}.json`,
  );
  await fs.writeFile(tempConfigPath, `${JSON.stringify(releaseConfig, null, 2)}\n`, "utf8");

  const env = {
    ...process.env,
    ODIRICO_BUILD_DIRECT: "1",
    ODIRICO_WINDOWS_ALLOW_UNSIGNED: allowUnsigned ? "1" : process.env.ODIRICO_WINDOWS_ALLOW_UNSIGNED,
  };

  const args = [
    "./node_modules/@tauri-apps/cli/tauri.js",
    "build",
    "--bundles",
    "nsis",
    "--config",
    tempConfigPath,
  ];

  try {
    const code = await run("node", args, env);
    process.exit(code);
  }
  finally {
    await fs.unlink(tempConfigPath).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
