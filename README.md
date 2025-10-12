# art.vault-post

Post your artifact to [Art.Vault](https://t.me/artifact_vault_bot) — a lightweight temporary storage for CI/CD artifacts
built on Telegram.

## Inputs

| Name            | Description                                                                        | Required |
|-----------------|------------------------------------------------------------------------------------|----------|
| `vault-secret`  | Secret token for your Vault channel                                                | Yes      |
| `project-name`  | Name of your project (used for grouping artifacts)                                 | Yes      |
| `artifact-path` | Path to the file or directory to upload. Directories will be automatically zipped. | Yes      |

## Example usage


#### - File upload
```yaml
- name: Post artifact to Art.Vault
  uses: zerdicorp/art.vault-post@v1
  with:
    vault-secret: ${{ secrets.ART_VAULT_SECRET }}
    project-name: my-service
    artifact-path: ./target/build.zip
```

#### - Directory upload (zipped automatically)
```yaml
- name: Post artifact to Art.Vault
  uses: zerdicorp/art.vault-post@v1
  with:
    vault-secret: ${{ secrets.ART_VAULT_SECRET }}
    project-name: my-service
    artifact-path: ./target/build
```