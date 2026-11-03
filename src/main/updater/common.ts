/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const ZENCORD_FILES = [
    IS_DISCORD_DESKTOP ? "patcher.js" : "zencordDesktopMain.js",
    IS_DISCORD_DESKTOP ? "preload.js" : "zencordDesktopPreload.js",
    IS_DISCORD_DESKTOP ? "renderer.js" : "zencordDesktopRenderer.js",
    IS_DISCORD_DESKTOP ? "renderer.css" : "zencordDesktopRenderer.css",
    "zencordDesktopMain.js",
    "zencordDesktopPreload.js",
    "zencordDesktopRenderer.js",
    "zencordDesktopRenderer.css",
    "vencordDesktopMain.js",
    "vencordDesktopPreload.js",
    "vencordDesktopRenderer.js",
    "vencordDesktopRenderer.css",
];
export const VENCORD_FILES = ZENCORD_FILES;

export function serializeErrors(func: (...args: any[]) => any) {
    return async function () {
        try {
            return {
                ok: true,
                value: await func(...arguments)
            };
        } catch (e: any) {
            return {
                ok: false,
                error: e instanceof Error ? {
                    // prototypes get lost, so turn error into plain object
                    ...e,
                    message: e.message,
                    name: e.name,
                    stack: e.stack
                } : e
            };
        }
    };
}
