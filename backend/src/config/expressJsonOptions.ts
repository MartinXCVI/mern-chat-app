import { OptionsJson } from 'body-parser'

/*
* Express JSON Parser Configuration
* 
* Configures how Express parses incoming JSON requests.
* These settings help prevent various attack vectors.
*/

const expressJsonOptions: OptionsJson = {
  limit: '5mb', // Prevents DDoS attacks through extremely large payloads.
  strict: true, // Only parsing arrays and objects. Prevents JSON pollution attacks with primitive values
  type: 'application/json',
  inflate: true, // Enables or disables handling deflated (compressed) bodies
}

export default expressJsonOptions