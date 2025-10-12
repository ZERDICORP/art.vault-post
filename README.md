# art.vault-post

Post your artifact to [Art.Vault](https://t.me/artifact_vault_bot) — a lightweight temporary storage for CI/CD artifacts
built on Telegram.

## Inputs

| Name           | Description                                        | Required |
|----------------|----------------------------------------------------|----------|
| `vault-secret` | Secret token for your Vault channel                | Yes      |
| `project-name` | Name of your project (used for grouping artifacts) | Yes      |
| `file-path`    | Path to the file to upload                         | Yes      |

## Example usage

```yaml
- name: Post artifact to Art.Vault
  uses: zerdicorp/art.vault-post@v1
  with:
    vault-secret: ${{ secrets.ART_VAULT_SECRET }}
    project-name: my-service
    file-path: ./target/build.zip
```