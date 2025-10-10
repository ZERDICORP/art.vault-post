import { getInput, setFailed, info } from "@actions/core";
const fetch = require("node-fetch");
const FormData = require("form-data");
import { createReadStream, existsSync } from "fs";

export async function run() {
  try {
    const vaultSecret = getInput("vault-secret");
    const projectName = getInput("project-name");
    const artifactName = getInput("artifact-name");
    const filePath = getInput("file-path");

    if (!vaultSecret) {
      throw new Error("vault-secret is required");
    }
    if (!projectName) {
      throw new Error("project-name is required");
    }
    if (!artifactName) {
      throw new Error("artifact-name is required");
    }
    if (!filePath) {
      throw new Error("file-path is required");
    }

    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    info(`[Art.Vault]: Posting artifact '${projectName}.${artifactName}'`);

    const url = `https://art-vault.nanikin.ru/${projectName}/${artifactName}`;

    const form = new FormData();
    form.append("file", createReadStream(filePath));

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

  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

if (!process.env.JEST_WORKER_ID) {
  run();
}
