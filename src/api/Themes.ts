/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings, SettingsStore } from "@api/Settings";
import { createAndAppendStyle } from "@utils/css";
import { isNonNullish } from "@utils/guards";
import { PopoutWindowStore } from "@webpack/common";
import { ThemeStore } from "@zencord/discord-types";

import { userStyleRootNode, vencordRootNode, zencordRootNode } from "./Styles";

let style: HTMLStyleElement;
let themesStyle: HTMLStyleElement;

const themeChangeListeners = new Set<() => void>();

async function toggle(isEnabled: boolean) {
    if (!style) {
        if (isEnabled) {
            style = createAndAppendStyle("zencord-custom-css", userStyleRootNode);
            VencordNative.quickCss.addChangeListener(css => {
                style.textContent = css;
                // At the time of writing this, changing textContent resets the disabled state
                style.disabled = !Settings.useQuickCss;
                updatePopoutWindows();
            });
            style.textContent = await VencordNative.quickCss.get();
        }
    } else
        style.disabled = !isEnabled;
}

// for cleanup
let previousThemeBlobObjectURLs = [] as string[];

async function initThemes() {
    themesStyle ??= createAndAppendStyle("zencord-themes", userStyleRootNode);

    const { themeLinks, enabledThemes } = Settings;

    const { ThemeStore } = require("@webpack/common/stores") as typeof import("@webpack/common/stores");

    // "darker" and "midnight" both count as dark
    // This function is first called on DOMContentLoaded, so ThemeStore may not have been loaded yet
    const activeTheme = ThemeStore == null
        ? undefined
        : ThemeStore.theme === "light" ? "light" : "dark";

    const links = themeLinks
        .map(rawLink => {
            const match = /^@(light|dark) (.*)/.exec(rawLink);
            if (!match) return rawLink;

            const [, mode, link] = match;
            return mode === activeTheme ? link : null;
        })
        .filter(link => link !== null);

    if (IS_WEB) {
        previousThemeBlobObjectURLs.forEach(url => URL.revokeObjectURL(url));

        const objectUrls = await Promise.all(enabledThemes.map(async theme => {
            const themeData = await VencordNative.themes.getThemeData(theme);
            if (!themeData) return null;

            const blob = new Blob([themeData], { type: "text/css" });
            return URL.createObjectURL(blob);
        }));

        previousThemeBlobObjectURLs = objectUrls.filter(isNonNullish);
        links.push(...previousThemeBlobObjectURLs);
    } else {
        const localThemes = enabledThemes.map(theme => `vencord:///themes/${theme}?v=${Date.now()}`);
        links.push(...localThemes);
    }

    themesStyle.textContent = links.map(link => `@import url("${link.trim()}");`).join("\n");
    updatePopoutWindows();
    themeChangeListeners.forEach(listener => listener());
}

function applyToPopout(popoutWindow: Window | undefined, key: string) {
    if (!popoutWindow?.document) return;
    // skip game overlay cuz it needs to stay transparent, themes broke it
    if (key === "DISCORD_OutOfProcessOverlay") return;

    const doc = popoutWindow.document;

    doc.querySelector("zencord-root, vencord-root")?.remove();

    doc.documentElement.appendChild((zencordRootNode ?? vencordRootNode).cloneNode(true));
}

function updatePopoutWindows() {
    if (!PopoutWindowStore) return;

    for (const key of PopoutWindowStore.getWindowKeys()) {
        applyToPopout(PopoutWindowStore.getWindow(key), key);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (IS_USERSCRIPT) return;

    initThemes();

    toggle(Settings.useQuickCss);
    SettingsStore.addChangeListener("useQuickCss", toggle);

    SettingsStore.addChangeListener("themeLinks", initThemes);
    SettingsStore.addChangeListener("enabledThemes", initThemes);

    window.addEventListener("message", event => {
        const { discordPopoutEvent } = event.data || {};
        if (discordPopoutEvent?.type !== "loaded") return;

        applyToPopout(PopoutWindowStore.getWindow(discordPopoutEvent.key), discordPopoutEvent.key);
    });

    if (!IS_WEB) {
        VencordNative.quickCss.addThemeChangeListener(initThemes);
    }
}, { once: true });

export function initQuickCssThemeStore(themeStore: ThemeStore) {
    if (IS_USERSCRIPT) return;

    initThemes();

    let currentTheme = themeStore.theme;
    themeStore.addChangeListener(() => {
        if (currentTheme === themeStore.theme) return;

        currentTheme = themeStore.theme;
        initThemes();
    });
}

export function addThemeChangeListener(listener: () => void) {
    themeChangeListeners.add(listener);
}

export function removeThemeChangeListener(listener: () => void) {
    themeChangeListeners.delete(listener);
}
