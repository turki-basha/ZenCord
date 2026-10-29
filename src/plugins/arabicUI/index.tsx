/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

import {
    discordSettingsTranslations,
    pluginNameTranslations,
    zencordTranslations
} from "./translations";

export const settings = definePluginSettings({
    translateDiscordSettings: {
        type: OptionType.BOOLEAN,
        description: "تعريب جميع صفحات وقوائم وخيارات إعدادات ديسكورد (User Settings)",
        default: true,
        onChange: () => {
            reapplyTranslations();
        }
    },
    translateZenCordUI: {
        type: OptionType.BOOLEAN,
        description: "تعريب إعدادات وقوائم زن كورد (ZenCord Settings)",
        default: true,
        onChange: () => {
            reapplyTranslations();
        }
    },
    translatePluginList: {
        type: OptionType.BOOLEAN,
        description: "تعريب أسماء ووصف أشهر الإضافات في قائمة Plugins",
        default: true,
        onChange: () => {
            reapplyTranslations();
        }
    },
    enableArabicFont: {
        type: OptionType.BOOLEAN,
        description: "تفعيل الخط العربي الأنيق (Cairo) في شاشات وإعدادات زن كورد وديسكورد",
        default: true,
        onChange: (enabled: boolean) => {
            if (enabled) {
                document.body.classList.add("vc-arabic-active");
            } else {
                document.body.classList.remove("vc-arabic-active");
            }
        }
    }
});

let observer: MutationObserver | null = null;
const originalTextMap = new WeakMap<Node, string>();
let isApplying = false;

function isIgnoredElement(el: HTMLElement): boolean {
    if (!el.tagName) return false;
    const tag = el.tagName;
    if (tag === "CODE" || tag === "PRE" || tag === "INPUT" || tag === "TEXTAREA" || tag === "SCRIPT" || tag === "STYLE") {
        return true;
    }
    if (el.isContentEditable) return true;
    if (el.classList?.contains("monaco-editor")) return true;

    // Ignore chat messages and message input areas completely
    if (el.id?.startsWith("message-content-") || el.id?.startsWith("chat-messages-")) return true;
    if (el.getAttribute?.("data-slate-editor") === "true") return true;

    const className = typeof el.className === "string" ? el.className : "";
    if (className.includes("messageContent") || className.includes("channelTextArea") || className.includes("slateTextArea")) {
        return true;
    }

    if (el.closest?.("[id^='message-content-'], [class*='messageContent'], [class*='channelTextArea'], [data-slate-editor='true']")) {
        return true;
    }

    return false;
}

function getTranslationForText(text: string): string | null {
    if (settings.store.translateZenCordUI !== false && zencordTranslations[text]) {
        return zencordTranslations[text];
    }
    if (settings.store.translateDiscordSettings !== false && discordSettingsTranslations[text]) {
        return discordSettingsTranslations[text];
    }
    if (settings.store.translatePluginList !== false && pluginNameTranslations[text]) {
        return pluginNameTranslations[text].name;
    }
    return null;
}

function translateNode(node: Node) {
    if (isApplying) return;

    if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.nodeValue;
        if (!raw) return;
        const text = raw.trim();
        if (!text) return;

        const translation = getTranslationForText(text);
        if (translation) {
            if (!originalTextMap.has(node)) {
                originalTextMap.set(node, raw);
            }
            node.nodeValue = raw.replace(text, translation);
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (isIgnoredElement(el)) return;

        for (const child of el.childNodes) {
            translateNode(child);
        }
    }
}

function reapplyTranslations() {
    isApplying = true;
    try {
        const target = document.getElementById("app-mount") || document.body;
        function walk(node: Node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const original = originalTextMap.get(node);
                const textToTest = (original ?? node.nodeValue)?.trim();
                if (!textToTest) return;

                const translation = getTranslationForText(textToTest);
                if (translation) {
                    if (!originalTextMap.has(node)) {
                        originalTextMap.set(node, node.nodeValue!);
                    }
                    const orig = originalTextMap.get(node)!;
                    node.nodeValue = orig.replace(textToTest, translation);
                } else if (original !== undefined) {
                    node.nodeValue = original;
                    originalTextMap.delete(node);
                }
                return;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                if (isIgnoredElement(el)) return;
                for (const child of el.childNodes) {
                    walk(child);
                }
            }
        }
        walk(target);
    } finally {
        isApplying = false;
    }
}

function startTranslationObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver(mutations => {
        if (isApplying) return;
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                translateNode(addedNode);
            }
            if (mutation.type === "characterData" && mutation.target) {
                translateNode(mutation.target);
            }
        }
    });

    const target = document.getElementById("app-mount") || document.body;
    observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Translate current DOM initially
    translateNode(target);
}

function revertTranslations(root: Node) {
    isApplying = true;
    try {
        function walkRevert(node: Node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const original = originalTextMap.get(node);
                if (original !== undefined) {
                    node.nodeValue = original;
                    originalTextMap.delete(node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                for (const child of node.childNodes) {
                    walkRevert(child);
                }
            }
        }
        walkRevert(root);
    } finally {
        isApplying = false;
    }
}

export default definePlugin({
    name: "ArabicUI",
    description: "تعريب شامل ومتكامل لإعدادات ديسكورد زن كورد إلى اللغة العربية مع تحسين مظهر الخط | Translates Discord & ZenCord Settings into Arabic with enhanced typography",
    authors: [Devs.ZenCord],
    settings,

    start() {
        if (settings.store.enableArabicFont) {
            document.body.classList.add("vc-arabic-active");
        }
        startTranslationObserver();
    },

    stop() {
        document.body.classList.remove("vc-arabic-active");
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        const target = document.getElementById("app-mount") || document.body;
        revertTranslations(target);
    }
});
