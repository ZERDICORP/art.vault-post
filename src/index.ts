import { getInput, setFailed, info } from "@actions/core";
const fetch = require("node-fetch");
const FormData = require("form-data");
import { createReadStream, existsSync, statSync, mkdirSync } from "fs";
import * as path from "path";
import * as archiver from "archiver";
import { createWriteStream } from "fs";

async function createZipFromDirectory(dirPath: string): Promise<string> {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  const dirName = path.basename(dirPath);
  const zipPath = path.join(tempDir, `${dirName}.zip`);

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      info(`[Art.Vault]: Created zip archive: ${zipPath} (${archive.pointer()} bytes)`);
      resolve(zipPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(dirPath, false);
    archive.finalize();
  });
}

export async function run() {
  try {
    const vaultSecret = getInput("vault-secret");
    const projectName = getInput("project-name");
    const artifactPath = getInput("artifact-path");

    if (!vaultSecret) {
      throw new Error("vault-secret is required");
    }
    if (!projectName) {
      throw new Error("project-name is required");
    }
    if (!artifactPath) {
      throw new Error("artifact-path is required");
    }

    if (!existsSync(artifactPath)) {
      throw new Error(`File or directory not found: ${artifactPath}`);
    }

    let actualFilePath = artifactPath;
    let fileName = path.basename(artifactPath);

    // Проверяем, является ли путь директорией
    const stats = statSync(artifactPath);
    if (stats.isDirectory()) {
      info(`[Art.Vault]: Detected directory, creating zip archive...`);
      actualFilePath = await createZipFromDirectory(artifactPath);
      fileName = path.basename(actualFilePath);
    }

    info(`[Art.Vault]: Posting artifact '${projectName}/${fileName}'`);

    const url = `https://art-vault.nanikin.ru/${projectName}`;

    const form = new FormData();
    form.append("file", createReadStream(actualFilePath));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Vault-Secret": vaultSecret,
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[Art.Vault]: Posting failed: ${errorText}`);
    }

    const responseText = await response.text();
    info(`[Art.Vault]: Posting successful!`);

  } catch (error: any) {
    setFailed(error?.message ?? "Unknown error");
  }
}

if (!process.env.JEST_WORKER_ID) {
  run();
}
