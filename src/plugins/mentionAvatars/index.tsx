/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { GuildRoleStore, SelectedGuildStore, UserStore, useState } from "@webpack/common";
import { User } from "@zencord/discord-types";

const settings = definePluginSettings({
    showAtSymbol: {
        type: OptionType.BOOLEAN,
        description: "Show @ symbol before user mentions",
        default: true
    }
});

function getUsernameString(username: string) {
    if (settings.store.showAtSymbol) return `@${username}`;
    return username;
}

function RoleIcon({ roleId, guildId }: { roleId: string, guildId: string; }) {
    const role = GuildRoleStore.getRole(guildId, roleId);
    if (!role?.icon) return null;

    return (
        <img
            src={`https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.png?size=20`}
            className="vc-mentionAvatars-icon"
            style={{ borderRadius: "30%" }}
        />
    );
}

function ServerOwnerIcon() {
    return (
        <svg aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24" className="vc-mentionAvatars-icon" style={{ fill: "#f0b232" }}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.8834 11.9077C16.6657 11.5044 18.0001 9.9077 18.0001 8.00598C18.0001 5.96916 16.4693 4.28218 14.4971 4.0367C15.4322 5.09511 16.0001 6.48524 16.0001 8.00598C16.0001 9.44888 15.4889 10.7742 14.6378 11.8102C14.7203 11.8418 14.8022 11.8743 14.8834 11.9077Z"
            />
        </svg>
    );
}

export default definePlugin({
    name: "MentionAvatars",
    description: "Shows user avatars and role icons inside mentions",
    tags: ["Appearance", "Customisation"],
    authors: [Devs.Ven, Devs.SerStars],

    patches: [
        {
            find: ".USER_MENTION)",
            replacement: {
                match: /children:`@\$\{(\i\?\?\i)\}`(?<=\.useName\((\i)\).+?)/,
                replace: "children:$self.renderUsername({username:$1,user:$2})"
            }
        },
        {
            find: ".ROLE_MENTION)",
            replacement: {
                match: /children:\[\i&&.{0,100}className:\i.\i,background:!1,.{0,50}?,\i(?=\])/,
                replace: "$&,$self.renderRoleIcon(arguments[0])"
            }
        },
        {
            // Same find as FullUserInChatbox
            find: '"text":"locked"',
            replacement: {
                // username == null ? `<@id>` : `@username`
                match: /null==\i\?`<@\$\{(\i)\}>`:`@\$\{(\i)\}`/,
                replace: "$self.renderUsernameWithId({id:$1,username:$2})"
            }
        }
    ],

    settings,

    renderUsernameWithId({ id, username }: { id: string; username: string; }) {
        try {
            const user = UserStore.getUser(id);
            return this.renderUsername({ user, username });
        } catch { }

        return getUsernameString(username);
    },

    renderUsername: ErrorBoundary.wrap((props: { user: User, username: string; }) => {
        const { user, username } = props;
        const [isHovering, setIsHovering] = useState(false);

        if (!user)
            return getUsernameString(username);

        return (
            <span
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <img
                    src={user.getAvatarURL(SelectedGuildStore.getGuildId(), 16, isHovering)}
                    className="vc-mentionAvatars-icon"
                    style={{ borderRadius: "50%" }}
                />
                {getUsernameString(username)}
            </span>
        );
    }, { noop: true }),

    renderRoleIcon: ErrorBoundary.wrap(({ roleId, guildId }: { roleId: string, guildId: string; }) => {
        return (
            <RoleIcon roleId={roleId} guildId={guildId} />
        );
    }, { noop: true })
});
