const aesjs = require('aes-js');

const key = new Uint8Array(process.env.KEY.split(','));

exports.encrypted = text => {
    const textBytes = aesjs.utils.utf8.toBytes(text);
    const encrytedBytes = new aesjs.ModeOfOperation
                    .ctr(key, new aesjs.Counter(3))
                    .encrypt(textBytes);
    return aesjs.utils.hex.fromBytes(encrytedBytes);
};

exports.decrypted = encrypteHex => {
    const encrytedBytes = aesjs.utils.hex.toBytes(encrypteHex);
    const decrytedBytes = new aesjs.ModeOfOperation
                    .ctr(key, new aesjs.Counter(3))
                    .decrypt(encrytedBytes);
    return aesjs.utils.utf8.fromBytes(decrytedBytes);
}
