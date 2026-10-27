/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./fixDiscordBadgePadding.css";

import { _getBadges, BadgePosition, BadgeUserArgs, ProfileBadge } from "@api/Badges";
import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { Heart } from "@components/Heart";
import { CopyIcon, LinkIcon } from "@components/Icons";
import { openContributorModal } from "@components/settings/tabs";
import { Devs } from "@utils/constants";
import { copyWithToast } from "@utils/discord";
import { Logger } from "@utils/Logger";
import { shouldShowContributorBadge } from "@utils/misc";
import definePlugin from "@utils/types";
import { ContextMenuApi, Forms, Menu, Modal, openModal, showToast, UserStore } from "@webpack/common";

import {
    createZenBadgeFromDb,
    ZenBadgesDatabase
} from "./zenBadges";

const CONTRIBUTOR_BADGE = "https://cdn.discordapp.com/emojis/1564698785551097986.webp?size=96";

const ContributorBadge: ProfileBadge = {
    id: "vencord_contributor_badge",
    description: "Vencord Contributor",
    iconSrc: CONTRIBUTOR_BADGE,
    position: BadgePosition.START,
    shouldShow: ({ userId }) => shouldShowContributorBadge(userId),
    onClick: (_, { userId }) => openContributorModal(UserStore.getUser(userId))
};

let DonorBadges = {} as ZenBadgesDatabase;

export const ZENCORD_API_BADGES_URL = "https://api.zencord.app/badges";
export const ZENCORD_GITHUB_FALLBACK_URL = "https://raw.githubusercontent.com/turki-basha/ZenCord/main/badges.json";
export const VENCORD_BADGES_URL = "https://badges.vencord.dev/badges.json";

async function loadBadges(noCache = false) {
    const init = {} as RequestInit;
    if (noCache)
        init.cache = "no-cache";

    const merged: ZenBadgesDatabase = {};

    try {
        const [apiRes, fallbackRes, venRes] = await Promise.allSettled([
            fetch(ZENCORD_API_BADGES_URL, init).then(r => r.ok ? r.json() : null),
            fetch(ZENCORD_GITHUB_FALLBACK_URL, init).then(r => r.ok ? r.json() : null),
            fetch(VENCORD_BADGES_URL, init).then(r => r.ok ? r.json() : null)
        ]);

        if (venRes.status === "fulfilled" && venRes.value && typeof venRes.value === "object") {
            Object.assign(merged, venRes.value);
        }

        // Apply GitHub fallback if present
        if (fallbackRes.status === "fulfilled" && fallbackRes.value && typeof fallbackRes.value === "object") {
            for (const [userId, badges] of Object.entries(fallbackRes.value as Record<string, any>)) {
                if (Array.isArray(badges)) {
                    merged[userId] = [...(merged[userId] || []), ...badges];
                }
            }
        }

        // Apply Website Database API (highest priority)
        if (apiRes.status === "fulfilled" && apiRes.value && typeof apiRes.value === "object") {
            for (const [userId, badges] of Object.entries(apiRes.value as Record<string, any>)) {
                if (Array.isArray(badges)) {
                    merged[userId] = [...(merged[userId] || []), ...badges];
                }
            }
        }
    } catch (e) {
        new Logger("BadgeAPI#loadBadges").error("Failed to load badges", e);
    }

    DonorBadges = merged;
}

let intervalId: any;

function BadgeContextMenu({ badge }: { badge: Omit<ProfileBadge, "id"> & BadgeUserArgs; }) {
    return (
        <Menu.Menu
            navId="vc-badge-context"
            onClose={ContextMenuApi.closeContextMenu}
            aria-label="Badge Options"
        >
            {badge.description && (
                <Menu.MenuItem
                    id="vc-badge-copy-name"
                    label="Copy Badge Name"
                    action={() => copyWithToast(badge.description!)}
                    leadingAccessory={{ type: "icon", icon: CopyIcon }}
                />
            )}
            {badge.iconSrc && (
                <Menu.MenuItem
                    id="vc-badge-copy-link"
                    label="Copy Badge Image Link"
                    action={() => copyWithToast(badge.iconSrc!)}
                    leadingAccessory={{ type: "icon", icon: LinkIcon }}
                />
            )}
        </Menu.Menu>
    );
}

export default definePlugin({
    name: "BadgeAPI",
    description: "API to add badges to users",
    authors: [Devs.Megu, Devs.Ven, Devs.TheSun],
    required: true,
    patches: [
        {
            find: "#{intl::PROFILE_USER_BADGES}",
            replacement: [
                {
                    match: /alt:" ","aria-hidden":!0,src:.{0,50}(\i).iconSrc/,
                    replace: "...$1.props,$&"
                },
                // Path with 2026-04-badge-discovery OFF
                {
                    match: /(?<=forceOpen:.{0,40}?ariaHidden:!0,)children:(?=.{0,50}?(\i)\.id)/,
                    replace: "children:$1.component?$self.renderBadgeComponent({...$1}):"
                },
                // Path with 2026-04-badge-discovery ON
                {
                    match: /(?<=fallbackIconSrc:.{0,50}?)children:(?=.{0,50}?(\i)\.id)/,
                    replace: "children:$1.component?$self.renderBadgeComponent({...$1}):"
                },
                // handle onClick and onContextMenu
                {
                    match: /href:(\i)\.link/,
                    replace: "...$self.getBadgeMouseEventHandlers($1),$&"
                }
            ]
        },
        {
            find: "getLegacyUsername(){",
            replacement: {
                match: /getBadges\(\)\{.{0,100}?return\[/,
                replace: "$&...$self.getBadges(this),"
            }
        }
    ],

    // for access from the console or other plugins
    get DonorBadges() {
        return DonorBadges;
    },

    toolboxActions: {
        async "Refetch Badges"() {
            await loadBadges(true);
            showToast({ text: "Successfully refetched badges!", variant: "success" });
        }
    },

    userProfileBadge: ContributorBadge,

    async start() {
        await loadBadges();

        clearInterval(intervalId);
        intervalId = setInterval(loadBadges, 1000 * 60 * 30); // 30 minutes
    },

    async stop() {
        clearInterval(intervalId);
    },

    getBadges(profile: { userId: string; guildId: string; }) {
        if (!profile) return [];

        try {
            return _getBadges(profile);
        } catch (e) {
            new Logger("BadgeAPI#getBadges").error(e);
            return [];
        }
    },

    renderBadgeComponent: ErrorBoundary.wrap((badge: ProfileBadge & BadgeUserArgs) => {
        const Component = badge.component!;
        return <Component {...badge} />;
    }, { noop: true }),


    getBadgeMouseEventHandlers(badge: ProfileBadge & BadgeUserArgs) {
        const handlers = {} as Record<string, (e: React.MouseEvent) => void>;

        if (!badge) return handlers; // sanity check

        const { onClick, onContextMenu } = badge;

        if (onClick) handlers.onClick = e => onClick(e, badge);
        if (onContextMenu) handlers.onContextMenu = e => onContextMenu(e, badge);

        return handlers;
    },

    getDonorBadges(userId: string) {
        return DonorBadges[userId]?.map((badge, idx) => createZenBadgeFromDb(badge, idx, userId));
    }
});
