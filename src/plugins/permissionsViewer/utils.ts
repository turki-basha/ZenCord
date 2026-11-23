/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { classNameFactory } from "@utils/css";
import { DefaultExtractAndLoadChunksRegex, extractAndLoadChunksLazy, findByPropsLazy } from "@webpack";
import { GuildRoleStore } from "@webpack/common";
import { Guild, GuildMember, Role } from "@zencord/discord-types";
import { PermissionOverwriteType } from "@zencord/discord-types/enums";

import { PermissionsSortOrder, settings } from ".";

const memberModViewSidebar = 'name:"GuildMemberModViewSidebar"';

// The sidebar's import is available at startup and includes the guild permission spec.
export const loadGetGuildPermissionSpecMap = extractAndLoadChunksLazy(
    [memberModViewSidebar],
    new RegExp(String.raw`createPromise:\(\)=>${DefaultExtractAndLoadChunksRegex.source},webpackId:[^,]+,${memberModViewSidebar}`)
);
export const { getGuildPermissionSpecMap } = findByPropsLazy("getGuildPermissionSpecMap");

export const cl = classNameFactory("vc-permviewer-");

export function getSortedRolesForMember({ id: guildId }: Guild, member: GuildMember) {
    // The guild id is the @everyone role
    return GuildRoleStore
        .getSortedRoles(guildId)
        .filter(role => role.id === guildId || member.roles.includes(role.id));
}

export function sortUserRoles(roles: Role[]) {
    switch (settings.store.permissionsSortOrder) {
        case PermissionsSortOrder.HighestRole:
            return roles.sort((a, b) => b.position - a.position);
        case PermissionsSortOrder.LowestRole:
            return roles.sort((a, b) => a.position - b.position);
        default:
            return roles;
    }
}

export function sortPermissionOverwrites<T extends { id: string; type: number; }>(overwrites: T[], guildId: string) {
    const roles = GuildRoleStore.getRolesSnapshot(guildId);

    return overwrites.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === PermissionOverwriteType.ROLE ? -1 : 1;
        }

        if (a.id === guildId) return 1;
        if (b.id === guildId) return -1;

        if (a.type === PermissionOverwriteType.ROLE) {
            return (roles[b.id]?.position ?? 0) - (roles[a.id]?.position ?? 0);
        }

        return 0;
    });
}
