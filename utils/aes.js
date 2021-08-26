const aesjs = require('aes-js');

const key = new Uint8Array(process.env.KEY.split(','));

exports.encrypted = text => {
    if (text === null || text === undefined)
        return null;
    const textBytes = aesjs.utils.utf8.toBytes(text);
    const encrytedBytes = new aesjs.ModeOfOperation
                    .ctr(key, new aesjs.Counter(13))
                    .encrypt(textBytes);
    return aesjs.utils.hex.fromBytes(encrytedBytes);
};

exports.decrypted = encrypteHex => {
    const encrytedBytes = aesjs.utils.hex.toBytes(encrypteHex);
    const decrytedBytes = new aesjs.ModeOfOperation
                    .ctr(key, new aesjs.Counter(13))
                    .decrypt(encrytedBytes);
    return aesjs.utils.utf8.fromBytes(decrytedBytes);
}
