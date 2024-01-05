/*
Copyright 2023 VirtualYou

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

crypto.ts - Crypto Utils Module
@author Unknown
@author David L Whitehurst

TODO - This needs to be Reviewed thoroughly!
*/

import * as forge from 'node-forge';

// Generate a random key and IV
const key = forge.random.getBytesSync(16);
const iv = forge.random.getBytesSync(16);

const encrypt = (token: string) => {
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(token));
    cipher.finish();
    const encrypted = cipher.output;
    return encrypted.toHex();
}
const decrypt = (gobbleDeeGook: forge.util.ByteStringBuffer) => {
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(gobbleDeeGook);
    decipher.finish();
    return decipher.output.toString();
}

const createHash = (str: string): string => {
    const md = forge.md.sha256.create();
    md.update(str);
    return md.digest().toHex();
};

const createThreeDigitRandomInteger = () => {
    return Math.floor(Math.random() * (999 - 100 + 1) + 100);
}

const cryptoUtils = {
    encrypt,
    decrypt,
    createHash,
    createThreeDigitRandomInteger,
};
export default cryptoUtils;