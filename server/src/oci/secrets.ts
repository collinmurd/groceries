import * as secrets from "oci-secrets";
import { VAULT_OCID } from "../constants";
import { getAuthProvider } from "./authProvider";

let secretClient: secrets.SecretsClient | undefined;

async function getSecretByName(secretName: string): Promise<string> {
  // check the local env first
  if (process.env[secretName]) {
    return Promise.resolve(process.env[secretName] as string);
  }

  const secretRequest: secrets.requests.GetSecretBundleByNameRequest = {
    secretName,    
    vaultId: VAULT_OCID
  }

  if (!secretClient) {
    secretClient = new secrets.SecretsClient({authenticationDetailsProvider: await getAuthProvider()});
  }

  return secretClient.getSecretBundleByName(secretRequest)
    .then(resp => {
      const content = resp.secretBundle.secretBundleContent?.content;
      if (!content) {
        throw new Error('Secret content is empty');
      }

      return Buffer.from(content, 'base64').toString('utf8');
    });
}

export async function getAuthPIN() {
  return getSecretByName('shared_pin');
}

export async function getJWTSigningKey() {
  return getSecretByName('token_signing_key');
}