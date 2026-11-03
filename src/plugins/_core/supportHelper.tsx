/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isPluginEnabled } from "@api/PluginManager";
import { definePluginSettings } from "@api/Settings";
import { getUserSettingLazy } from "@api/UserSettings";
import { Card } from "@components/Card";
import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { Link } from "@components/Link";
import { CONTRIB_ROLE_ID, Devs, DONOR_ROLE_ID, KNOWN_ISSUES_CHANNEL_ID, REGULAR_ROLE_ID, SUPPORT_CATEGORY_ID, SUPPORT_CHANNEL_ID, VENBOT_USER_ID } from "@utils/constants";
import { sendMessage } from "@utils/discord";
import { Logger } from "@utils/Logger";
import { Margins } from "@utils/margins";
import { isPluginDev, tryOrElse } from "@utils/misc";
import { relaunch } from "@utils/native";
import { onlyOnce } from "@utils/onlyOnce";
import { makeCodeblock } from "@utils/text";
import definePlugin from "@utils/types";
import { checkForUpdates, update } from "@utils/updater";
import { Button, ChannelStore, ConfirmModal, Forms, Parser, PermissionsBits, PermissionStore, RelationshipStore, showToast, Text, UserStore } from "@webpack/common";
import { Channel, RenderModalProps } from "@zencord/discord-types";
import { JSX } from "react";

import gitHash from "~git-hash";
import gitRemote from "~git-remote";
import plugins, { PluginMeta } from "~plugins";

import SettingsPlugin from "./settings";

const AdditionalAllowedChannelIds = [
    "1024286218801926184", // Vencord > #bot-commands
];

const TrustedRolesIds = [
    CONTRIB_ROLE_ID, // contributor
    REGULAR_ROLE_ID, // regular
    DONOR_ROLE_ID, // donor
];

const ShowCurrentGame = getUserSettingLazy<boolean>("status", "showCurrentGame")!;

const isSupportAllowedChannel = (channel: Channel) => channel.parent_id === SUPPORT_CATEGORY_ID || AdditionalAllowedChannelIds.includes(channel.id);

async function forceUpdate() {
    const outdated = await checkForUpdates();
    if (outdated) {
        await update();
        relaunch();
    }

    return outdated;
}

async function generateDebugInfoMessage() {
    const { RELEASE_CHANNEL } = window.GLOBAL_ENV;

    const client = (() => {
        if (IS_DISCORD_DESKTOP) return `Discord Desktop v${DiscordNative.app.getVersion()}`;
        if (IS_VESKTOP) return `Vesktop v${VesktopNative.app.getVersion()}`;
        if ("legcord" in window) return `Legcord v${window.legcord.version}`;

        // @ts-expect-error
        const name = typeof unsafeWindow !== "undefined" ? "UserScript" : "Web";
        return `${name} (${navigator.userAgent})`;
    })();

    const info = {
        ZenCord:
            `v${VERSION} • [${gitHash}](<https://github.com/${gitRemote}/commit/${gitHash}>)` +
            `${SettingsPlugin.additionalInfo} - ${Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(BUILD_TIMESTAMP)}`,
        Client: `${RELEASE_CHANNEL} ~ ${client}`,
        Platform: navigator.platform
    };

    if (IS_DISCORD_DESKTOP) {
        info["Last Crash Reason"] = (await tryOrElse(() => DiscordNative.processUtils.getLastCrash(), undefined))?.rendererCrashReason ?? "N/A";
    }

    const commonIssues = {
        "Activity Sharing disabled": tryOrElse(() => !ShowCurrentGame.getSetting(), false),
        "ZenCord DevBuild": !IS_STANDALONE,
        "Has UserPlugins": Object.values(PluginMeta).some(m => m.userPlugin),
        "More than two weeks out of date": BUILD_TIMESTAMP < Date.now() - 12096e5,
    };

    let content = `>>> ${Object.entries(info).map(([k, v]) => `**${k}**: ${v}`).join("\n")}`;
    content += "\n" + Object.entries(commonIssues)
        .filter(([, v]) => v).map(([k]) => `⚠️ ${k}`)
        .join("\n");

    return content.trim();
}

function generatePluginList() {
    const isApiPlugin = (plugin: string) => plugin.endsWith("API") || plugins[plugin].required;

    const enabledPlugins = Object.keys(plugins)
        .filter(p => isPluginEnabled(p) && !isApiPlugin(p));

    const enabledStockPlugins = enabledPlugins.filter(p => !PluginMeta[p].userPlugin);
    const enabledUserPlugins = enabledPlugins.filter(p => PluginMeta[p].userPlugin);


    let content = `**Enabled Plugins (${enabledStockPlugins.length}):**\n${makeCodeblock(enabledStockPlugins.join(", "))}`;

    if (enabledUserPlugins.length) {
        content += `**Enabled UserPlugins (${enabledUserPlugins.length}):**\n${makeCodeblock(enabledUserPlugins.join(", "))}`;
    }

    return content;
}

const checkForUpdatesOnce = onlyOnce(checkForUpdates);

const settings = definePluginSettings({}).withPrivateSettings<{
    dismissedDevBuildWarning?: boolean;
}>();

function DevBuildConfirmModal(props: RenderModalProps) {
    const s = settings.use(["dismissedDevBuildWarning"]);

    return (
        <ConfirmModal
            {...props}
            title="Hold on!"
            confirmText="Understood"
            variant="primary"
            checkboxProps={{
                checked: s.dismissedDevBuildWarning === true,
                onChange: checked => s.dismissedDevBuildWarning = checked
            }}
        >
            <div>
                <Forms.FormText>You are using a custom build of Vencord, which we do not provide support for!</Forms.FormText>

                <Forms.FormText className={Margins.top8}>
                    We only provide support for <Link href="https://vencord.dev/download">official builds</Link>.
                    Either <Link href="https://vencord.dev/download">switch to an official build</Link> or figure your issue out yourself.
                </Forms.FormText>

                <Text variant="text-md/bold" className={Margins.top8}>You will be banned from receiving support if you ignore this rule.</Text>
            </div>
        </ConfirmModal>
    );
}

export default definePlugin({
    name: "SupportHelper",
    required: false,
    enabledByDefault: false,
    description: "Helps us provide support to you",
    authors: [Devs.Ven],
    dependencies: ["UserSettingsAPI"],

    settings,

    patches: [{
        find: "#{intl::BEGINNING_DM}",
        replacement: {
            match: /#{intl::BEGINNING_DM},{.+?}\),(?=.{0,300}(\i)\.isMultiUserDM)/,
            replace: "$& $self.renderContributorDmWarningCard({ channel: $1 }),"
        }
    }],

    commands: [
        {
            name: "zencord-debug",
            description: "Send ZenCord debug info",
            predicate: ctx => isPluginDev(UserStore.getCurrentUser()?.id) || isSupportAllowedChannel(ctx.channel),
            execute: async () => ({ content: await generateDebugInfoMessage() })
        },
        {
            name: "zencord-plugins",
            description: "Send ZenCord plugin list",
            predicate: ctx => isPluginDev(UserStore.getCurrentUser()?.id) || isSupportAllowedChannel(ctx.channel),
            execute: () => ({ content: generatePluginList() })
        }
    ],

    renderMessageAccessory(props) {
        if (props.message.vencordEmbeddedBy) return null;

        const buttons = [] as JSX.Element[];

        const shouldAddUpdateButton =
            !IS_UPDATER_DISABLED
            && (
                (props.channel.id === KNOWN_ISSUES_CHANNEL_ID) ||
                (props.channel.parent_id === SUPPORT_CATEGORY_ID && props.message.author.id === VENBOT_USER_ID)
            )
            && props.message.content?.toLowerCase().includes("update");

        if (shouldAddUpdateButton) {
            buttons.push(
                <Button
                    key="vc-update"
                    color={Button.Colors.GREEN}
                    onClick={async () => {
                        try {
                            if (await forceUpdate())
                                showToast({ text: "Success! Restarting...", variant: "success" });
                            else
                                showToast({ text: "Already up to date!" });
                        } catch (e) {
                            new Logger(this.name).error("Error while updating:", e);
                            showToast({ text: "Failed to update :(", variant: "critical" });
                        }
                    }}
                >
                    Update Now
                </Button>
            );
        }

        if (props.channel.parent_id === SUPPORT_CATEGORY_ID && PermissionStore.can(PermissionsBits.SEND_MESSAGES, props.channel)) {
            if (props.message.content.includes("/zencord-debug") || props.message.content.includes("/vencord-debug") || props.message.content.includes("/zencord-plugins") || props.message.content.includes("/vencord-plugins")) {
                buttons.push(
                    <Button
                        key="vc-dbg"
                        color={Button.Colors.PRIMARY}
                        onClick={async () => sendMessage(props.channel.id, { content: await generateDebugInfoMessage() })}
                    >
                        Run /zencord-debug
                    </Button>,
                    <Button
                        key="vc-plg-list"
                        color={Button.Colors.PRIMARY}
                        onClick={async () => sendMessage(props.channel.id, { content: generatePluginList() })}
                    >
                        Run /zencord-plugins
                    </Button>
                );
            }
        }

        return buttons.length
            ? <Flex>{buttons}</Flex>
            : null;
    },

    renderContributorDmWarningCard: ErrorBoundary.wrap(({ channel }) => {
        const userId = channel.getRecipientId();
        if (!isPluginDev(userId)) return null;
        if (RelationshipStore.isFriend(userId) || isPluginDev(UserStore.getCurrentUser()?.id)) return null;

        return (
            <Card variant="warning" className={Margins.top8} defaultPadding>
                Please do not private message Vencord plugin developers for support!
                <br />
                Instead, use the Vencord support channel: {Parser.parse("https://discord.com/channels/1015060230222131221/1026515880080842772")}
                {!ChannelStore.getChannel(SUPPORT_CHANNEL_ID) && " (Click the link to join)"}
            </Card>
        );
    }, { noop: true }),
});
