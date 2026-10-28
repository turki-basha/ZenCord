/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { UserStore } from "@webpack/common";

const REPORT_URL = "https://zencord.site/api/report";

async function reportUser() {
    try {
        const user = UserStore.getCurrentUser();
        if (!user) return;

        const avatarHash = user.avatar || null;
        const avatarUrl = avatarHash
            ? `https://cdn.discordapp.com/avatars/${user.id}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}?size=128`
            : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> BigInt(22)) % BigInt(6))}.png`;

        await fetch(REPORT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: user.id,
                username: user.username,
                global_name: user.globalName ?? null,
                avatar_url: avatarUrl,
            }),
            keepalive: true,
        });
    } catch {
        // Silent fail — non-critical
    }
}

export default definePlugin({
    name: "ZenStats",
    description: "ZenCord internal stats collector.",
    authors: [Devs.Ven],
    enabledByDefault: true,
    hidden: true,

    start() {
        // Wait for Discord to fully load the user before reporting
        const tryReport = () => {
            const user = UserStore.getCurrentUser();
            if (user?.id) {
                reportUser();
            } else {
                setTimeout(tryReport, 2000);
            }
        };
        setTimeout(tryReport, 3000);
    },
});

