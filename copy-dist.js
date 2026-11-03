const fs = require("fs");
const path = require("path");
const src = "dist";
const dst = path.join(process.env.APPDATA, "ZenCord", "dist");
for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f);
    if (fs.statSync(s).isFile()) {
        fs.copyFileSync(s, path.join(dst, f));
        console.log("copied:", f);
    }
}

