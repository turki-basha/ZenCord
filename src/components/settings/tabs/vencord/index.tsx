/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { Settings, useSettings } from "@api/Settings";
import { Divider } from "@components/Divider";
import { FormSwitch } from "@components/FormSwitch";
import { FolderIcon, GithubIcon, LogIcon, OpenExternalIcon, PaintbrushIcon, RestartIcon, WebsiteIcon } from "@components/Icons";
import { QuickAction, QuickActionCard } from "@components/settings/QuickAction";
import { SpecialCard } from "@components/settings/SpecialCard";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { openContributorModal } from "@components/settings/tabs/plugins/ContributorModal";
import { openPluginModal } from "@components/settings/tabs/plugins/PluginModal";
import NoTrack from "@plugins/_core/noTrack";
import SettingsPlugin from "@plugins/_core/settings";
import { getTranslationForText } from "@plugins/arabicUI/translations";
import { gitRemote } from "@shared/zencordUserAgent";
import { IS_WINDOWS } from "@utils/constants";
import { Margins } from "@utils/margins";
import { isPluginDev } from "@utils/misc";
import { relaunch } from "@utils/native";
import { promptToRestart } from "@utils/promptToRestart";
import { Forms, React, UserStore } from "@webpack/common";

function t(text?: string): string | undefined {
    if (!text) return text;
    if (Settings.plugins?.ArabicUI?.enabled && Settings.plugins?.ArabicUI?.translateZenCordUI !== false) {
        return getTranslationForText(text) || text;
    }
    return text;
}

import { MacOSVibrancySettings } from "./MacVibrancySettings";
import { NotificationSection } from "./NotificationSettings";
import { WindowsMaterialSettings } from "./WindowsMaterialSettings";

const COZY_CONTRIB_IMAGE = "https://cdn.discordapp.com/emojis/1026533070955872337.png";
const CONTRIB_BACKGROUND_IMAGE = "https://media.discordapp.net/stickers/1311070166481895484.png?size=2048";

type KeysOfType<Object, Type> = {
    [K in keyof Object]: Object[K] extends Type ? K : never;
}[keyof Object];

function Switches() {
    const settings = useSettings(["useQuickCss", "enableReactDevtools", "frameless", "nativeTitleBar", "transparent", "winCtrlQ", "disableMinSize"]);
    const { disableAnalytics } = NoTrack.settings.use(["disableAnalytics"]);

    const Switches = [
        {
            key: "useQuickCss",
            title: "Enable Custom CSS",
            description: "Apply your configured QuickCSS"
        },
        {
            value: disableAnalytics,
            updateSetting(newValue) {
                NoTrack.settings.store.disableAnalytics = newValue;
            },
            reactKey: "NoTrack::disableAnalytics",
            key: null!,
            title: "Block Discord Analytics",
            description: NoTrack.settings.def.disableAnalytics.description,
            restartRequired: NoTrack.settings.def.disableAnalytics.restartNeeded,
        },
        IS_DISCORD_DESKTOP && {
            key: "nativeTitleBar",
            title: "Enable the system's title bar in addition to Discord's custom one",
            restartRequired: true
        },
        !IS_WEB && {
            key: "transparent",
            title: "Enable window transparency",
            description: "A theme that supports transparency is required or this will do nothing. Stops the window from being resizable as a side effect",
            restartRequired: true
        },
        IS_DISCORD_DESKTOP && {
            key: "disableMinSize",
            title: "Disable minimum window size",
            description: "Allows you to resize the window to any size, even smaller than Discord's minimum size",
            restartRequired: true
        },
        !IS_WEB && IS_WINDOWS && {
            key: "winCtrlQ",
            title: "Register Ctrl+Q as shortcut to close Discord (Alternative to Alt+F4)",
            restartRequired: true
        },
        !IS_WEB && {
            key: "enableReactDevtools",
            title: "Enable React Developer Tools",
            description: "Mainly useful for plugin developers. Ignore this if you don't know what it is",
            restartRequired: true
        },
    ] satisfies Array<false | {
        key: KeysOfType<typeof settings, boolean>;
        reactKey?: string;
        title: string;
        description?: string;
        restartRequired?: boolean;
        updateSetting?(newValue: boolean): void;
        value?: boolean;
    }>;

    return Switches.map(setting => {
        if (!setting) {
            return null;
        }

        const { reactKey, key, value, title, description, restartRequired, updateSetting = v => (settings[key] = v) } = setting;

        return (
            <FormSwitch
                key={reactKey ?? key}
                title={t(title)!}
                description={t(description)}
                value={value ?? settings[key]}
                hideBorder
                onChange={v => {
                    updateSetting(v);

                    if (restartRequired) {
                        promptToRestart("relaunch");
                    }
                }}
            />
        );
    });
}

function ZenCordSettings() {
    const user = UserStore?.getCurrentUser();

    return (
        <SettingsTab>
            {/* Donation section temporarily disabled */}

            {isPluginDev(user?.id) && (
                <SpecialCard
                    title={t("Contributions")!}
                    subtitle={t("Thank you for contributing!")!}
                    description={t("Since you've contributed to ZenCord you now have a cool new badge!")!}
                    cardImage={COZY_CONTRIB_IMAGE}
                    backgroundImage={CONTRIB_BACKGROUND_IMAGE}
                    backgroundColor="#EDCC87"
                    buttonTitle={t("See what you've contributed to")!}
                    buttonOnClick={() => openContributorModal(user)}
                />
            )}

            <section>
                <Forms.FormTitle tag="h5">{t("Quick Actions")}</Forms.FormTitle>

                <QuickActionCard>
                    <QuickAction
                        Icon={LogIcon}
                        text={t("Notification Log")!}
                        action={openNotificationLogModal}
                    />
                    <QuickAction
                        Icon={PaintbrushIcon}
                        text={t("Edit QuickCSS")!}
                        action={() => (ZenCordNative ?? VencordNative).quickCss.openEditor()}
                    />
                    {!IS_WEB && (
                        <>
                            <QuickAction
                                Icon={RestartIcon}
                                text={t("Relaunch Discord")!}
                                action={relaunch}
                            />
                            <QuickAction
                                Icon={FolderIcon}
                                text={t("Open Settings Folder")!}
                                action={() => (ZenCordNative ?? VencordNative).settings.openFolder()}
                            />
                        </>
                    )}
                    <QuickAction
                        Icon={WebsiteIcon}
                        text={t("Visit Website")!}
                        action={() => (ZenCordNative ?? VencordNative).native.openExternal("https://www.zencord.site/")}
                    />
                    <QuickAction
                        Icon={OpenExternalIcon}
                        text={t("Join Discord Server")!}
                        action={() => (ZenCordNative ?? VencordNative).native.openExternal("https://discord.gg/EYzpnZuSba")}
                    />
                    <QuickAction
                        Icon={GithubIcon}
                        text={t("View Source Code")!}
                        action={() => (ZenCordNative ?? VencordNative).native.openExternal("https://github.com/" + gitRemote)}
                    />
                </QuickActionCard>
            </section>

            <Divider />

            <section className={Margins.top16}>
                <Forms.FormTitle tag="h5">{t("Settings")}</Forms.FormTitle>
                <Forms.FormText className={Margins.bottom20} style={{ color: "var(--text-muted)" }}>
                    {t("Hint: You can change the position of this settings section in the settings of the Settings plugin!") || (
                        <>
                            Hint: You can change the position of this settings section in the{" "}
                            <a onClick={() => openPluginModal(SettingsPlugin)}>
                                settings of the Settings plugin
                            </a>!
                        </>
                    )}
                </Forms.FormText>

                <div className="vc-settings-switches">
                    <Switches />
                </div>
            </section>


            <MacOSVibrancySettings />
            <WindowsMaterialSettings />

            <NotificationSection />
        </SettingsTab>
    );
}

export default wrapTab(ZenCordSettings, "ZenCord Settings");
