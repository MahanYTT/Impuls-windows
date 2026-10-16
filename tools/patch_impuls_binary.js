const fs = require('fs');
const path = require('path');

const exePath = process.argv[2] || 'Telegram.exe';
const outPath = process.argv[3] || 'Impuls.exe';

if (!fs.existsSync(exePath)) {
  console.error('Source binary not found:', exePath);
  process.exit(1);
}

console.log(`Patching ${exePath} -> ${outPath}...`);
const buf = fs.readFileSync(exePath);

const targetIP = '80.201.130.248\0';
const targetPort = 20443;
const targetVA = 0x148730180n;

// 1. Write IP string at 0x872f380
buf.write(targetIP, 0x872f380, 'ascii');

// 2. Overwrite all IP strings in .rdata table with 80.201.130.248\0
const ipOffsets = [0x872f298, 0x872f2a8, 0x872f2b8, 0x872f340, 0x872f350, 0x872f360, 0x872f370, 0x872f380];
for (const off of ipOffsets) {
  buf.write(targetIP, off, 'ascii');
}

// 3. Patch kBuiltInDcs (0x7c07a60) - 6 entries
for (let i = 0; i < 6; i++) {
  const entryOffset = 0x7c07a60 + i * 24;
  buf.writeBigUInt64LE(targetVA, entryOffset + 8);
  buf.writeUInt32LE(targetPort, entryOffset + 16);
}

// 4. Patch kBuiltInDcsTest (0x7c07990) - 3 entries
for (let i = 0; i < 3; i++) {
  const entryOffset = 0x7c07990 + i * 24;
  buf.writeBigUInt64LE(targetVA, entryOffset + 8);
  buf.writeUInt32LE(targetPort, entryOffset + 16);
}

// 5. Patch kBuiltInDcsIPv6 (0x7c079f8) - 4 entries
for (let i = 0; i < 4; i++) {
  const entryOffset = 0x7c079f8 + i * 24;
  buf.writeBigUInt64LE(targetVA, entryOffset + 8);
  buf.writeUInt32LE(targetPort, entryOffset + 16);
}

// 6. Replace RSA keys at 0x872f560 and 0x872f710
const keyFromRepo = '-----BEGIN RSA PUBLIC KEY-----\n\
MIIBCgKCAQEAu+3tvscWDAlEvVylTeMr5FpU2AjgqzoQHPjzp69r0YAtq0a8rX0M\n\
Ue78F/FRAqBaEbZW6WBzF3AjOlNYpOtvvwGhl9rGCgziunbd9nwcKJBMDWS9O7Mz\n\
/8xjz/swIB4V56XcjOhrjUHJ/GniFKoum00xeEcYnr5xnLesvpVMq97Ga6b+xt3H\n\
RftHY/Zy1dG5zs8upuiAOlEiKilhu1IthfMjFG3NF6TiGrO9YU3YixFbJy67jtHk\n\
v5FarscM2fC5iWQ2eP1y6jXR64sGU3QjncvozYOePrH9jGcnmzUmj42x/H28IjJQ\n\
9EjEc22sPOuauK0IF2QiCGh+TfsKCK189wIDAQAB\n\
-----END RSA PUBLIC KEY-----';

buf.write(keyFromRepo, 0x872f560, 'ascii');
buf.write(keyFromRepo, 0x872f710, 'ascii');

// 7. Replace FileDescription & ProductName (UTF-16LE)
const oldName = Buffer.from('Telegram Desktop\0', 'utf16le');
const newName = Buffer.from('Impuls Desktop\0\0\0', 'utf16le');
let idx = -1;
while ((idx = buf.indexOf(oldName, idx + 1)) !== -1) {
  buf.set(newName, idx);
}

// 8. Replace CompanyName (UTF-16LE)
const oldCompany = Buffer.from('Telegram FZ-LLC\0', 'utf16le');
const newCompany = Buffer.from('Impuls Team\0\0\0\0\0', 'utf16le');
let cIdx = -1;
while ((cIdx = buf.indexOf(oldCompany, cIdx + 1)) !== -1) {
  buf.set(newCompany, cIdx);
}

fs.writeFileSync(outPath, buf);
console.log(`Successfully generated ${outPath} (${buf.length} bytes).`);
