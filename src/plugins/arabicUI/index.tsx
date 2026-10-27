/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

import { pluginNameTranslations, translations } from "./translations";

const settings = definePluginSettings({
    enableArabicFont: {
        type: OptionType.BOOLEAN,
        description: "تفعيل الخط العربي الأنيق (Cairo) في إعدادات زن كورد",
        default: true
    },
    translatePluginList: {
        type: OptionType.BOOLEAN,
        description: "تعريب أسماء ووصف أشهر الإضافات في قائمة Plugins",
        default: true
    }
});

let observer: MutationObserver | null = null;
const originalTextMap = new WeakMap<Node, string>();

function translateNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue?.trim();
        if (!text) return;

        if (translations[text]) {
            if (!originalTextMap.has(node)) {
                originalTextMap.set(node, node.nodeValue!);
            }
            node.nodeValue = node.nodeValue!.replace(text, translations[text]);
            return;
        }

        if (settings.store.translatePluginList && pluginNameTranslations[text]) {
            if (!originalTextMap.has(node)) {
                originalTextMap.set(node, node.nodeValue!);
            }
            node.nodeValue = node.nodeValue!.replace(text, pluginNameTranslations[text].name);
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        // Don't translate codeblocks, editors or inputs
        if (el.tagName === "CODE" || el.tagName === "PRE" || el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.classList.contains("monaco-editor")) {
            return;
        }

        for (const child of el.childNodes) {
            translateNode(child);
        }
    }
}

function startTranslationObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver(mutations => {
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
    if (root.nodeType === Node.TEXT_NODE) {
        const original = originalTextMap.get(root);
        if (original !== undefined) {
            root.nodeValue = original;
        }
    } else if (root.nodeType === Node.ELEMENT_NODE) {
        for (const child of root.childNodes) {
            revertTranslations(child);
        }
    }
}

export default definePlugin({
    name: "ArabicUI",
    description: "تحويل واجهة وقوائم وإعدادات زن كورد إلى اللغة العربية مع تحسين مظهر الخط | Translates ZenCord UI & Settings into Arabic with enhanced Arabic typography",
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
