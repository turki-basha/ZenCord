/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType, StartAt } from "@utils/types";

import "./styles.css";

export const settings = definePluginSettings({
    ultraProfile: {
        type: OptionType.BOOLEAN,
        description: "Master toggle for ZenCord Ultra Performance (GPU acceleration, blur removal, zero lag)",
        default: true,
        restartNeeded: false,
    },
    disableBlur: {
        type: OptionType.BOOLEAN,
        description: "Disable heavy backdrop-filter blur to dramatically boost FPS on integrated GPUs",
        default: true,
        restartNeeded: false,
    },
    hardwareAccelerateChat: {
        type: OptionType.BOOLEAN,
        description: "Force GPU content containment on messages and scrollers for ultra-smooth 60FPS scrolling",
        default: true,
        restartNeeded: false,
    },
    disableTypingAnimation: {
        type: OptionType.BOOLEAN,
        description: "Stop CPU-heavy typing indicator animations",
        default: true,
        restartNeeded: false,
    },
});

export function applyPerformanceClasses() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const s = settings.store;

    if (s.ultraProfile || s.disableBlur) {
        root.classList.add("zc-no-blur");
    } else {
        root.classList.remove("zc-no-blur");
    }

    if (s.ultraProfile || s.hardwareAccelerateChat) {
        root.classList.add("zc-chat-accel");
    } else {
        root.classList.remove("zc-chat-accel");
    }

    if (s.ultraProfile || s.disableTypingAnimation) {
        root.classList.add("zc-no-anim");
    } else {
        root.classList.remove("zc-no-anim");
    }
}

export default definePlugin({
    name: "ZenPerformance",
    description: "ZenCord Ultra Performance Profile - GPU acceleration, blur removal, and lag elimination.",
    authors: [Devs.Ven],
    enabledByDefault: true,
    required: true,
    hidden: true,

    settings,

    startAt: StartAt.Init,

    start() {
        applyPerformanceClasses();
        settings.addChangeListener(applyPerformanceClasses);
    },

    stop() {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        root.classList.remove("zc-no-blur", "zc-chat-accel", "zc-no-anim");
    },
});
