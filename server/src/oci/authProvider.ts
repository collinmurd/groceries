import { OCI_CONFIG_FILE, OCI_SDK_PROFILE } from "../constants";
import { pino } from 'pino';
import * as fs from "fs";
import * as common from "oci-common";
import * as os from "os";

const logger = pino();

// @ts-ignore oci types are bad
export const getAuthProvider = async (): common.AuthenticationDetailsProvider => {
  try {
    if (configFileExists()) {
      logger.info(`Using OCI config file at ${OCI_CONFIG_FILE} with profile ${OCI_SDK_PROFILE}`);
      return new common.ConfigFileAuthenticationDetailsProvider(OCI_CONFIG_FILE, OCI_SDK_PROFILE);
    } else {
      logger.info(`OCI config file not found at ${OCI_CONFIG_FILE}, using instance principal authentication`);
      return await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
    }
  } catch (err) {
    logger.error('Error checking OCI config file:', err);
    throw err;
  }
}

function configFileExists(): boolean {
  const path = OCI_CONFIG_FILE.replace('~', os.homedir());
  return fs.existsSync(path);
}