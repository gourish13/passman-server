const aesjs = require('aes-js');

const key = new Uint8Array(process.env.KEY.split(','));
const counter = 13;

exports.encrypted = (text, strkey) => {
    if (text === null || text === undefined)
        return null;
    const usekey = strkey ? new Uint8Array(strkey.split(',')) : key;
    const textBytes = aesjs.utils.utf8.toBytes(text);
    const encrytedBytes = new aesjs.ModeOfOperation
                    .ctr(usekey, new aesjs.Counter(counter))
                    .encrypt(textBytes);
    return aesjs.utils.hex.fromBytes(encrytedBytes);
};

exports.decrypted = (encryptedHex, strkey) => {
    const usekey = strkey ? new Uint8Array(strkey.split(',')) : key;
    const encrytedBytes = aesjs.utils.hex.toBytes(encryptedHex);
    const decrytedBytes = new aesjs.ModeOfOperation
                    .ctr(usekey, new aesjs.Counter(counter))
                    .decrypt(encrytedBytes);
    return aesjs.utils.utf8.fromBytes(decrytedBytes);
}

exports.generateKey = () => {
    const length = 32, limit = 128;
    return Array.from({length}, 
        () => Math.floor(Math.random() * limit)).toString();
}