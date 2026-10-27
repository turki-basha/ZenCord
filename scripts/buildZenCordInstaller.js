const fs = require('fs');
const path = require('path');

const srcExe = 'c:\\Users\\turki\\OneDrive\\Desktop\\VencordInstaller.exe';
const dstExe = 'c:\\Users\\turki\\OneDrive\\Desktop\\ZenCordInstaller.exe';

console.log('Loading source installer from:', srcExe);
const buf = Buffer.from(fs.readFileSync(srcExe));

// 1. Replace GitHub release API URL (exact same length: 63 bytes)
const oldUrl = 'https://api.github.com/repos/Vendicated/Vencord/releases/latest';
const newUrl = 'http://api.github.com/repos/turki-basha/ZenCord/releases/latest';
const urlPos = buf.indexOf(oldUrl);
if (urlPos !== -1) {
    buf.write(newUrl, urlPos, 'ascii');
    console.log(`[✓] Patched Release URL at offset ${urlPos} -> ${newUrl}`);
} else {
    console.warn('[!] Release URL not found');
}

// 2. Replace all "Vencord" with "ZenCord" (exact same length: 7 bytes)
// Target specific phrases to keep stability perfect
const replacements = [
    ['Vencord Installer', 'ZenCord Installer'],
    ['Vencord was successfully installed', 'ZenCord was successfully installed'],
    ['Vencord has been uninstalled', 'ZenCord has been uninstalled'],
    ['Vencord Installed', 'ZenCord Installed'],
    ['Found existing Vencord', 'Found existing ZenCord'],
    ['Vencord Discord Mod', 'ZenCord Discord Mod'],
    ['Vencord builds from', 'ZenCord builds from'],
    ['// Vencord', '// ZenCord']
];

for (const [from, to] of replacements) {
    let p = 0;
    let count = 0;
    while ((p = buf.indexOf(from, p)) !== -1) {
        buf.write(to, p, 'utf8');
        count++;
        p += from.length;
    }
    console.log(`[✓] Replaced "${from}" -> "${to}" (${count} occurrences)`);
}

// 3. Replace embedded GUI window PNG icon (offset 6831168, max length 11198)
const newIconPng = fs.readFileSync(path.join(__dirname, 'zencord96.png'));
console.log('New icon PNG size:', newIconPng.length, 'bytes');

const icon1Offset = 6831168;
const icon1MaxLen = 11198;
if (newIconPng.length <= icon1MaxLen) {
    // Write new PNG
    newIconPng.copy(buf, icon1Offset);
    // Pad remaining bytes up to IEND + 1 with zeros
    buf.fill(0, icon1Offset + newIconPng.length, icon1Offset + icon1MaxLen);
    console.log(`[✓] Patched GUI window icon at offset ${icon1Offset}`);
} else {
    console.error(`[!] New icon is too large for icon1 slot (${newIconPng.length} > ${icon1MaxLen})`);
}

// 4. Replace PE resource icon (offset 11476280, max length 9519)
const icon2Offset = 11476280;
const icon2MaxLen = 9519;
if (newIconPng.length <= icon2MaxLen) {
    newIconPng.copy(buf, icon2Offset);
    buf.fill(0, icon2Offset + newIconPng.length, icon2Offset + icon2MaxLen);
    // Update PE resource size at 0xaf1cf4 (11476212)
    const sizeOffset = 11476212;
    buf.writeUInt32LE(newIconPng.length, sizeOffset);
    console.log(`[✓] Patched PE file icon at offset ${icon2Offset}, updated resource size to ${newIconPng.length}`);
} else {
    console.error(`[!] New icon is too large for icon2 slot (${newIconPng.length} > ${icon2MaxLen})`);
}

// Write the modified executable
fs.writeFileSync(dstExe, buf);
console.log('\nSUCCESS! Generated ZenCordInstaller.exe:');
console.log('File size:', buf.length, 'bytes');
console.log('Saved to:', dstExe);
