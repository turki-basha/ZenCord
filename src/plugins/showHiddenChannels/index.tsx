/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { Card } from "@components/Card";
import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Link } from "@components/Link";
import { Paragraph } from "@components/Paragraph";
import { Devs } from "@utils/constants";
import { classNameFactory } from "@utils/css";
import { classes } from "@utils/misc";
import definePlugin, { OptionType } from "@utils/types";
import { findCssClassesLazy } from "@webpack";
import { ChannelStore, PermissionsBits, PermissionStore, Tooltip } from "@webpack/common";
import type { Channel } from "@zencord/discord-types";

import HiddenChannelLockScreen from "./components/HiddenChannelLockScreen";

export const cl = classNameFactory("vc-shc-");

const ChannelListClasses = findCssClassesLazy("modeSelected", "modeMuted", "unread", "icon");

const enum ShowMode {
    LockIcon,
    HiddenIconWithMutedStyle
}

export const settings = definePluginSettings({
    showMode: {
        description: "The mode used to display hidden channels.",
        type: OptionType.SELECT,
        options: [
            { label: "Plain style with Lock Icon instead", value: ShowMode.LockIcon, default: true },
            { label: "Muted style with hidden eye icon on the right", value: ShowMode.HiddenIconWithMutedStyle },
        ],
        restartNeeded: true
    }
});

function isUncategorized(objChannel: { channel: Channel; comparator: number; }) {
    return objChannel.channel.id === "null" && objChannel.channel.name === "Uncategorized" && objChannel.comparator === -1;
}

export default definePlugin({
    name: "ShowHiddenChannels",
    description: "Shows hidden channels. Discord heavily limited this functionality. More info in the plugin settings.",
    tags: ["Servers", "Utility"],
    authors: [Devs.BigDuck, Devs.AverageReactEnjoyer, Devs.D3SOX, Devs.Ven, Devs.Nuckyz, Devs.Nickyux, Devs.Rini],
    settings,

    settingsAboutComponent() {
        return (
            <Card variant="danger">
                <Flex flexDirection="column" gap="0.5em">
                    <Heading tag="h3">Limited Functionality</Heading>
                    <Paragraph>
                        Discord patched most of this plugin's functionality (<Link href="https://docs.discord.com/developers/change-log#channel-obfuscation-for-users-and-bots">read their announcement</Link>).
                        Hidden channels now show up as "No Access" instead, and seeing things like the name, topic, or people with access is no longer possible.
                    </Paragraph>
                    <Paragraph>
                        There is nothing we can do to fix this. However, you can still know that channels exist and see who's connected to private voice channels.
                    </Paragraph>
                </Flex>
            </Card>
        );
    },

    patches: [
        {
            // RenderLevel defines if a channel is hidden, collapsed in category, visible, etc
            find: '"placeholder-channel-id"',
            replacement: [
                // Remove the special logic for channels we don't have access to
                {
                    match: /if\(!\i\.\i\.can\(\i\.\i\.VIEW_CHANNEL.+?{if\(this\.id===\i\).+?threadIds:\[\]}}/,
                    replace: ""
                },
                // Make channels we dont have access to be the same level as normal ones
                {
                    match: /(this\.record\)\?{renderLevel:(.+?),threadIds.+?renderLevel:).+?(?=,threadIds)/g,
                    replace: (_, rest, defaultRenderLevel) => `${rest}${defaultRenderLevel}`
                },
                // Remove permission checking for getRenderLevel function
                {
                    match: /(getRenderLevel\(\i\){.+?return)!\i\.\i\.can\(\i\.\i\.VIEW_CHANNEL,this\.record\)\|\|/,
                    replace: (_, rest) => `${rest} `
                }
            ]
        },
        {
            find: "#{intl::UNREAD_POSTS}",
            replacement: [
                {
                    // Always show threads even if we can't read them
                    match: /let \i=null!=\i\?!\i\.can\(\i\.\i\.VIEW_CHANNEL,\i\):!\i;/,
                    replace: ""
                },
                {
                    match: /(?<=\.hasUnread\(\i\.id\).+?hasJoined:)\i(?=,)/,
                    replace: "true"
                }
            ]
        },
        {
            find: "getGuildChannelUnreadState(",
            replacement: {
                // Don't show unread state if not readable
                match: /(return \i\.\i\.hasUnread\(\i\.id\))/,
                replace: "$self.isHiddenChannel(arguments[0])?false:$1"
            }
        },
        {
            find: "isChannelGatedAndVisible(",
            replacement: {
                // Allows hidden channels to be selected
                match: /return!\i&&\i/,
                replace: "return true"
            }
        },
        {
            find: ".hideMutedChannels",
            replacement: {
                match: /(?<=\.getCollapsedCategories\(\i\);)/,
                replace: "if($self.settings.store.hideMutedChannels)return arguments[0];"
            }
        },
        {
            find: ".HEADER_BAR_BADGE_VOICE_CALL",
            replacement: {
                match: /(?<=\i=\i\.\i\.getChannel\(\i\);).+?(?=if\(null==\i\)return null;)/,
                replace: ""
            }
        },
        {
            find: "canWithPartialContext(",
            replacement: {
                match: /(?<=canWithPartialContext\(\i\.\i\.VIEW_CHANNEL,\{channelId:\i\.id\}\))(?=\?\(0,\i\.jsx\)\(\i\.\i,\{channel:\i,)/,
                replace: "||true"
            }
        },
        {
            find: "VoiceChannelEmptyState",
            replacement: {
                // Don't show "No one is here" if we can't connect
                match: /\(0,\i\.jsx\)\(\i\.\i,\{channel:\i\}\)/,
                replace: "$self.isHiddenChannel(arguments[0]?.channel,true)?null:$&"
            }
        },
        {
            find: "#{intl::CHANNEL_LOCKED}",
            replacement: [
                {
                    match: /(?<=\i===\i\.\i\.GUILD_VOICE.{0,100}?\(0,\i\.jsx\)\(\i\.\i,\{)tooltip:\i\.\i\.intl\.string\(\i\.\i\.CHANNEL_LOCKED\)/,
                    replace: "tooltip:null"
                },
                {
                    // Replaces the lock icon with our icon on voice channels if we can't connect
                    match: /(?<=\i===\i\.\i\.GUILD_VOICE.{0,100}?)children:\(0,\i\.jsx\)\(\i\.\i,\{className:\i\.\i\}\)/,
                    replace: "children:$self.settings.store.showMode===0?$self.LockIcon():$self.HiddenChannelIcon()"
                }
            ]
        },
        {
            find: "channel:arguments[0].channel,connected:",
            replacement: {
                // Replaces the lock icon with our icon on non-voice channels
                match: /children:\(0,\i\.jsx\)\(\i\.\i,\{className:\i\.\i\}\)/,
                replace: "children:$self.settings.store.showMode===0?$self.LockIcon():$self.HiddenChannelIcon()"
            }
        },
        {
            find: "#{intl::CHANNEL_CALL_START_CONVERSATION_SPEAKER}",
            replacement: [
                {
                    // Replaces the chat window with our lock screen
                    match: /(?<=if\(null==(\i)\)return null;).+?(?=return\(0,\i\.jsxs?\)\(\i\.\i,\{channel:\1,)/,
                    replace: "if($self.isHiddenChannel($1))return $self.HiddenChannelLockScreen($1);"
                },
                {
                    // Replaces the forum chat window with our lock screen
                    match: /(?<=return null==(\i)\?null:\(0,\i\.jsx\)\(\i\.\i,\{)channel:\1(?=,)/,
                    replace: "channel:$self.isHiddenChannel($1)?{...$1,isForumPost:()=>false}:$1"
                }
            ]
        },
        {
            find: ",openChatWithoutConnecting:",
            replacement: {
                // Show inside voice channel instead of trying to join them when clicking on a channel mention
                match: /(?<=getChannel\(\i\);if\(null!=(\i))(?=&&.{0,100}?selectVoiceChannel)/,
                replace: (_, channel) => `&&!$self.isHiddenChannel(${channel})`
            }
        },
        {
            find: '"GuildChannelStore"',
            replacement: [
                {
                    // Make GuildChannelStore contain hidden channels
                    match: /isChannelGated\(.+?\)(?=&&)/,
                    replace: m => `${m}&&false`
                },
                {
                    // Filter hidden channels from GuildChannelStore.getChannels unless told otherwise
                    match: /(?<=getChannels\(\i)(\){.*?)return (.+?)}/,
                    replace: (_, rest, channels) => `,shouldIncludeHidden${rest}return $self.resolveGuildChannels(${channels},shouldIncludeHidden??arguments[0]==="@favorites");}`
                },
            ]
        },
        {
            find: "GuildTooltip - ",
            replacement: {
                // Make GuildChannelStore.getChannels return hidden channels
                match: /(?<=getChannels\(\i)(?=\))/,
                replace: ",true"
            }
        },
        {
            find: '"NowPlayingViewStore"',
            replacement: {
                // Make active now voice states on hidden channels
                match: /(getVoiceStateForUser.{0,150}?)&&\i\.\i\.canWithPartialContext.{0,20}VIEW_CHANNEL.+?}\)(?=\?)/,
                replace: "$1"
            }
        }
    ],

    isHiddenChannel(channel: Channel & { channelId?: string; }, checkConnect = false) {
        try {
            if (channel == null || Object.hasOwn(channel, "channelId") && channel.channelId == null) return false;

            if (channel.channelId != null) channel = ChannelStore.getChannel(channel.channelId);
            if (channel == null || channel.isDM() || channel.isGroupDM() || channel.isMultiUserDM()) return false;
            if (["browse", "customize", "guide"].includes(channel.id)) return false;

            return !PermissionStore.can(PermissionsBits.VIEW_CHANNEL, channel) || checkConnect && !PermissionStore.can(PermissionsBits.CONNECT, channel);
        } catch (e) {
            console.error("[ViewHiddenChannels#isHiddenChannel]: ", e);
            return false;
        }
    },

    resolveGuildChannels(channels: Record<string | number, Array<{ channel: Channel; comparator: number; }> | string | number>, shouldIncludeHidden: boolean) {
        if (shouldIncludeHidden) return channels;

        const res = {};
        for (const [key, maybeObjChannels] of Object.entries(channels)) {
            if (!Array.isArray(maybeObjChannels)) {
                res[key] = maybeObjChannels;
                continue;
            }

            res[key] ??= [];

            for (const objChannel of maybeObjChannels) {
                if (isUncategorized(objChannel) || objChannel.channel.id === null || !this.isHiddenChannel(objChannel.channel)) res[key].push(objChannel);
            }
        }

        return res;
    },

    HiddenChannelLockScreen: (channel: any) => <HiddenChannelLockScreen channel={channel} />,

    LockIcon: ErrorBoundary.wrap(() => (
        <svg
            className={ChannelListClasses.icon}
            height="18"
            width="20"
            viewBox="0 0 24 24"
            aria-hidden={true}
            role="img"
        >
            <path fill="currentcolor" fillRule="evenodd" d="M17 11V7C17 4.243 14.756 2 12 2C9.242 2 7 4.243 7 7V11C5.897 11 5 11.896 5 13V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V13C19 11.896 18.103 11 17 11ZM12 18C11.172 18 10.5 17.328 10.5 16.5C10.5 15.672 11.172 15 12 15C12.828 15 13.5 15.672 13.5 16.5C13.5 17.328 12.828 18 12 18ZM15 11H9V7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V11Z" />
        </svg>
    ), { noop: true }),

    HiddenChannelIcon: ErrorBoundary.wrap(() => (
        <Tooltip text="Hidden Channel">
            {({ onMouseLeave, onMouseEnter }) => (
                <svg
                    onMouseLeave={onMouseLeave}
                    onMouseEnter={onMouseEnter}
                    className={classes(ChannelListClasses.icon, cl("hidden-channel-icon"))}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    aria-hidden={true}
                    role="img"
                >
                    <path fill="currentcolor" fillRule="evenodd" d="m19.8 22.6-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM12 16q.275 0 .512-.025.238-.025.513-.1l-5.4-5.4q-.075.275-.1.513-.025.237-.025.512 0 1.875 1.312 3.188Q10.125 16 12 16Zm7.3.45-3.175-3.15q.175-.425.275-.862.1-.438.1-.938 0-1.875-1.312-3.188Q13.875 7 12 7q-.5 0-.938.1-.437.1-.862.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm-4.625-4.6-3-3q.7-.125 1.288.112.587.238 1.012.688.425.45.613 1.038.187.587.087 1.162Z" />
                </svg>
            )}
        </Tooltip>
    ), { noop: true })
});
