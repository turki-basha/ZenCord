/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ipcMain";

import { app, net, protocol } from "electron";
import { join } from "path";
import { pathToFileURL } from "url";

import { initCsp } from "./csp";
import { RendererSettings } from "./settings";
import { IS_VANILLA, THEMES_DIR } from "./utils/constants";
import { ensureSafePath } from "./utils/ensureSafePath";
import { installExt } from "./utils/extensions";

if (IS_VESKTOP || !IS_VANILLA) {
    app.whenReady().then(() => {
        const handleProtocol = ({ url: unsafeUrl }: { url: string }) => {
            const prefix = unsafeUrl.startsWith("zencord://") ? "zencord://" : "vencord://";
            let url = decodeURI(unsafeUrl).slice(prefix.length).replace(/\?v=\d+$/, "");

            if (url.endsWith("/")) url = url.slice(0, -1);

            if (url.startsWith("/themes/")) {
                const theme = url.slice("/themes/".length);

                const safeUrl = ensureSafePath(THEMES_DIR, theme);
                if (!safeUrl) {
                    return new Response(null, {
                        status: 404
                    });
                }

                return net.fetch(pathToFileURL(safeUrl).toString());
            }

            // Source Maps! Maybe there's a better way but since the renderer is executed
            // from a string I don't think any other form of sourcemaps would work

            switch (url) {
                case "renderer.js.map":
                case "zencordDesktopRenderer.js.map":
                case "vencordDesktopRenderer.js.map":
                case "preload.js.map":
                case "zencordDesktopPreload.js.map":
                case "vencordDesktopPreload.js.map":
                case "patcher.js.map":
                case "zencordDesktopMain.js.map":
                case "vencordDesktopMain.js.map":
                    return net.fetch(pathToFileURL(join(__dirname, url)).toString());
                default:
                    return new Response(null, {
                        status: 404
                    });
            }
        };

        protocol.handle("zencord", handleProtocol);
        protocol.handle("vencord", handleProtocol);

        try {
            if (RendererSettings.store.enableReactDevtools)
                installExt("fmkadmapgofadopljbjfkapdkoienihi")
                    .then(() => console.info("[ZenCord] Installed React Developer Tools"))
                    .catch(err => console.error("[ZenCord] Failed to install React Developer Tools", err));
        } catch { }


        initCsp();
    });
}

if (IS_DISCORD_DESKTOP) {
    require("./patcher");
}
