import { OCI_CONFIG_FILE, OCI_SDK_PROFILE } from "../constants";
import * as fs from "fs";
import * as os from "os";

export function getAuthProvider() {
  try {
    if (configFileExists()) {
      console.log(`Using OCI config file at ${OCI_CONFIG_FILE} with profile ${OCI_SDK_PROFILE}`);
      const { ConfigFileAuthenticationDetailsProvider } = require("oci-sdk");
      return new ConfigFileAuthenticationDetailsProvider(OCI_CONFIG_FILE, OCI_SDK_PROFILE);
    } else {
      console.log(`OCI config file not found at ${OCI_CONFIG_FILE}, using instance principal authentication`);
      const { InstancePrincipalsAuthenticationDetailsProvider } = require("oci-common");
      return InstancePrincipalsAuthenticationDetailsProvider.builder().build();
    }
  } catch (err) {
    console.error('Error checking OCI config file:', err);
  }
}

function configFileExists(): boolean {
  const path = OCI_CONFIG_FILE.replace('~', os.homedir());
  return fs.existsSync(path);
}