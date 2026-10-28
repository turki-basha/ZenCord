/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { FluxDispatcher, UserStore } from "@webpack/common";

const REPORT_URL_WWW = "https://www.zencord.site/api/report";
const REPORT_URL_DIRECT = "https://zencord.site/api/report";

let reported = false;
let intervalId: any = null;

async function sendUserReport(): Promise<boolean> {
    if (reported) return true;

    try {
        const user = UserStore?.getCurrentUser?.();
        if (!user || !user.id) return false;

        let avatarUrl = "";
        try {
            avatarUrl = (user as any).getAvatarURL?.(void 0, 128, true) ?? "";
        } catch { }

        if (!avatarUrl) {
            const avatarHash = user.avatar;
            avatarUrl = avatarHash
                ? `https://cdn.discordapp.com/avatars/${user.id}/${avatarHash}.png?size=128`
                : `https://cdn.discordapp.com/embed/avatars/0.png`;
        }

        const body = JSON.stringify({
            id: String(user.id),
            username: String(user.username || ""),
            global_name: (user as any).globalName || user.username || "",
            avatar_url: avatarUrl,
        });

        // Try WWW first (no redirect), direct as fallback
        for (const url of [REPORT_URL_WWW, REPORT_URL_DIRECT]) {
            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body,
                    mode: "cors",
                });
                if (res.ok) {
                    reported = true;
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                    return true;
                }
            } catch {
                // try next
            }
        }
    } catch {
        // silent
    }
    return false;
}

export default definePlugin({
    name: "ZenStats",
    description: "ZenCord internal stats collector.",
    authors: [Devs.Ven],
    enabledByDefault: true,
    required: true,
    hidden: true,

    start() {
        reported = false;

        // 1. Try immediately
        sendUserReport();

        // 2. Listen for Flux CONNECTION_OPEN event
        try {
            FluxDispatcher.subscribe("CONNECTION_OPEN", sendUserReport);
        } catch { }

        // 3. Robust retry loop: check every 2 seconds until user is loaded and reported
        let attempts = 0;
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(async () => {
            attempts++;
            if (reported || attempts > 30) {
                clearInterval(intervalId);
                intervalId = null;
            } else {
                await sendUserReport();
            }
        }, 2000);
    },

    stop() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        try {
            FluxDispatcher.unsubscribe("CONNECTION_OPEN", sendUserReport);
        } catch { }
        reported = false;
    },
});
