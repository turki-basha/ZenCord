/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

import { installDiscordHook, uninstallDiscordHook } from "./discordHook";
import { applyPluginOverlay, removePluginOverlay } from "./pluginOverlay";
import {
    getTranslationForText,
    normalizeText,
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
        description: "تعريب إعدادات وقوائم زنكورد (ZenCord Settings & Tabs)",
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
    translateRoles: {
        type: OptionType.BOOLEAN,
        description: "تعريب أسماء الرتب والرولات (معطّل افتراضياً للحفاظ على أسماء رتب السيرفرات الأصلية)",
        default: false,
        onChange: () => {
            reapplyTranslations();
        }
    },
    enableArabicFont: {
        type: OptionType.BOOLEAN,
        description: "تفعيل الخطوط العربية الأنيقة في شاشات وإعدادات زنكورد وديسكورد",
        default: true,
        onChange: () => {
            applyArabicClasses();
        }
    },
    selectedFont: {
        type: OptionType.SELECT,
        description: "نوع الخط العربي المفضل",
        options: [
            { label: "Cairo (القاهرة - الافتراضي)", value: "cairo", default: true },
            { label: "Tajawal (تجوّل - انسيابي وعصري)", value: "tajawal" },
            { label: "Almarai (المراعي - هندسي نقي)", value: "almarai" },
            { label: "Readex Pro (ريديكس - عالي الوضوح)", value: "readex" },
            { label: "El Messiri (المسيري - لمسة فنية)", value: "elmessiri" }
        ],
        onChange: () => {
            applyArabicClasses();
        }
    },
    enableRTL: {
        type: OptionType.BOOLEAN,
        description: "تفعيل الاتجاه من اليمين إلى اليسار (RTL) في صفحات وإعدادات زنكورد",
        default: false,
        onChange: () => {
            applyArabicClasses();
        }
    }
});

function applyArabicClasses() {
    if (typeof document === "undefined") return;
    const b = document.body;
    const fontClasses = [
        "zc-arabic-active",
        "zc-arabic-font-tajawal",
        "zc-arabic-font-almarai",
        "zc-arabic-font-readex",
        "zc-arabic-font-elmessiri"
    ];

    if (settings.store.enableArabicFont) {
        b.classList.add("zc-arabic-active");
        fontClasses.forEach(cls => b.classList.remove(cls));

        const font = settings.store.selectedFont || "cairo";
        if (font !== "cairo") {
            b.classList.add(`zc-arabic-font-${font}`);
        } else {
            b.classList.add("zc-arabic-active");
        }
    } else {
        fontClasses.forEach(cls => b.classList.remove(cls));
    }

    if (settings.store.enableRTL) {
        b.classList.add("zc-arabic-rtl");
    } else {
        b.classList.remove("zc-arabic-rtl");
    }
}

let observer: MutationObserver | null = null;
const originalTextMap = new WeakMap<Node, string>();
const originalAttrMap = new WeakMap<Element, Record<string, string>>();
let isApplying = false;
let batchTimeout: number | null = null;
const pendingNodes = new Set<Node>();

function isRoleElement(el: HTMLElement): boolean {
    if (el.hasAttribute?.("data-role-id")) return true;

    const className = typeof el.className === "string" ? el.className.toLowerCase() : "";
    if (
        className.includes("rolename") ||
        className.includes("rolepill") ||
        className.includes("memberroles") ||
        className.includes("roleslist") ||
        className.includes("roledot") ||
        className.includes("rolecircle") ||
        className.includes("roleicon") ||
        className.includes("rolerow") ||
        className.includes("roleselection")
    ) {
        return true;
    }

    if (el.closest?.(
        '[class*="roleName"], [class*="rolePill"], [class*="memberRoles"], [class*="rolesList"], [data-role-id], [class*="roleDot"], [class*="roleCircle"], [class*="roleRow"]'
    )) {
        return true;
    }

    // Role group headers in member list e.g. "ONLINE — 5", "MEMBERS — 12", "ADMIN — 2"
    if (el.closest?.('[class*="membersGroup"], [class*="memberList"] h3, [class*="membersWrap"] h3')) {
        return true;
    }

    return false;
}

function isIgnoredElement(el: HTMLElement): boolean {
    if (!el.tagName) return false;
    const tag = el.tagName;
    if (tag === "CODE" || tag === "PRE" || tag === "TEXTAREA" || tag === "SCRIPT" || tag === "STYLE") {
        return true;
    }
    if (el.isContentEditable) return true;
    if (el.classList?.contains("monaco-editor")) return true;

    // Strict exclusion of chat messages and message writing box
    if (el.id?.startsWith("message-content-") || el.id?.startsWith("chat-messages-")) return true;
    if (el.getAttribute?.("data-slate-editor") === "true") return true;

    const className = typeof el.className === "string" ? el.className.toLowerCase() : "";
    if (className.includes("messagecontent") || className.includes("channeltextarea") || className.includes("slatetextarea")) {
        return true;
    }

    if (el.closest?.("[id^='message-content-'], [class*='messageContent'], [class*='channelTextArea'], [data-slate-editor='true']")) {
        return true;
    }

    // Prevent translating usernames and nicknames
    if (
        className.includes("username") ||
        className.includes("nickname") ||
        className.includes("usercard") ||
        el.closest?.('[class*="username"], [class*="nickname"]')
    ) {
        return true;
    }

    // Server roles protection if translateRoles is off
    if (settings.store.translateRoles !== true && isRoleElement(el)) {
        return true;
    }

    return false;
}

function translateAttributes(el: HTMLElement) {
    // Translate search input placeholder
    if (el.tagName === "INPUT") {
        const input = el as HTMLInputElement;
        if (input.placeholder) {
            const ph = input.placeholder.trim();
            const trans = getTranslationForText(ph);
            if (trans && input.placeholder !== trans) {
                if (!originalAttrMap.has(el)) originalAttrMap.set(el, {});
                const map = originalAttrMap.get(el)!;
                if (!map.placeholder) map.placeholder = input.placeholder;
                input.placeholder = trans;
            }
        }
    }

    // Translate aria-label
    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel) {
        const clean = ariaLabel.trim();
        const trans = getTranslationForText(clean);
        if (trans && ariaLabel !== trans) {
            if (!originalAttrMap.has(el)) originalAttrMap.set(el, {});
            const map = originalAttrMap.get(el)!;
            if (!map["aria-label"]) map["aria-label"] = ariaLabel;
            el.setAttribute("aria-label", trans);
        }
    }
}

function translateNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.nodeValue;
        if (!raw) return;
        const text = raw.trim();
        if (!text) return;

        // Skip pure numbers or single symbols
        if (/^[\d\s.,:/#-]+$/.test(text)) return;

        const parent = node.parentElement;
        if (parent && isIgnoredElement(parent)) return;

        let translation: string | null = null;
        if (settings.store.translateZenCordUI !== false) {
            translation = zencordTranslations[text] || zencordTranslations[normalizeText(text)];
        }
        if (!translation && settings.store.translateDiscordSettings !== false) {
            translation = getTranslationForText(text);
        }
        if (!translation && (pluginNameTranslations[text] || pluginNameTranslations[normalizeText(text)])) {
            translation = (pluginNameTranslations[text] || pluginNameTranslations[normalizeText(text)]).name;
        }

        if (translation && text !== translation) {
            if (!originalTextMap.has(node)) {
                originalTextMap.set(node, raw);
            }
            node.nodeValue = raw.replace(text, () => translation!);
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (isIgnoredElement(el)) return;

        translateAttributes(el);

        for (const child of el.childNodes) {
            translateNode(child);
        }
    }
}

function processPendingTranslations() {
    isApplying = true;
    try {
        for (const node of pendingNodes) {
            translateNode(node);
        }
        pendingNodes.clear();
    } finally {
        isApplying = false;
        batchTimeout = null;
    }
}

function scheduleTranslation(node: Node) {
    pendingNodes.add(node);
    if (batchTimeout === null) {
        batchTimeout = requestAnimationFrame(processPendingTranslations);
    }
}

function reapplyTranslations() {
    isApplying = true;
    try {
        const target = document.getElementById("app-mount") || document.body;
        function walk(node: Node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const parent = node.parentElement;
                const original = originalTextMap.get(node);
                const textToTest = (original ?? node.nodeValue)?.trim();
                if (!textToTest) return;

                if (parent && isIgnoredElement(parent)) {
                    if (original !== undefined) {
                        node.nodeValue = original;
                        originalTextMap.delete(node);
                    }
                    return;
                }

                let translation: string | null = null;
                if (settings.store.translateZenCordUI !== false) {
                    translation = zencordTranslations[textToTest] || zencordTranslations[normalizeText(textToTest)];
                }
                if (!translation && settings.store.translateDiscordSettings !== false) {
                    translation = getTranslationForText(textToTest);
                }
                if (!translation && (pluginNameTranslations[textToTest] || pluginNameTranslations[normalizeText(textToTest)])) {
                    translation = (pluginNameTranslations[textToTest] || pluginNameTranslations[normalizeText(textToTest)]).name;
                }

                if (translation) {
                    if (!originalTextMap.has(node)) {
                        originalTextMap.set(node, node.nodeValue!);
                    }
                    const orig = originalTextMap.get(node)!;
                    node.nodeValue = orig.replace(textToTest, () => translation!);
                } else if (original !== undefined) {
                    node.nodeValue = original;
                    originalTextMap.delete(node);
                }
                return;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                if (isIgnoredElement(el)) return;
                translateAttributes(el);
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
                scheduleTranslation(addedNode);
            }
            if (mutation.type === "characterData" && mutation.target) {
                scheduleTranslation(mutation.target);
            }
        }
    });

    const target = document.getElementById("app-mount") || document.body;
    observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Initial translation pass
    isApplying = true;
    try {
        translateNode(target);
    } finally {
        isApplying = false;
    }
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
                const el = node as HTMLElement;
                const map = originalAttrMap.get(el);
                if (map) {
                    for (const [attr, val] of Object.entries(map)) {
                        if (attr === "placeholder" && el.tagName === "INPUT") {
                            (el as HTMLInputElement).placeholder = val;
                        } else {
                            el.setAttribute(attr, val);
                        }
                    }
                    originalAttrMap.delete(el);
                }
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
    description: "تعريب شامل ومتكامل لإعدادات ديسكورد زنكورد إلى اللغة العربية مع تحسين مظهر الخطوط والاتجاه | Translates Discord & ZenCord Settings into Arabic with enhanced typography",
    authors: [Devs.ZenCord],
    settings,

    start() {
        applyArabicClasses();
        installDiscordHook();
        applyPluginOverlay();
        startTranslationObserver();
    },

    stop() {
        if (typeof document !== "undefined") {
            document.body.classList.remove(
                "zc-arabic-active",
                "zc-arabic-rtl",
                "zc-arabic-font-tajawal",
                "zc-arabic-font-almarai",
                "zc-arabic-font-readex",
                "zc-arabic-font-elmessiri"
            );
        }
        removePluginOverlay();
        uninstallDiscordHook();
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (batchTimeout !== null) {
            cancelAnimationFrame(batchTimeout);
            batchTimeout = null;
        }
        pendingNodes.clear();

        const target = document.getElementById("app-mount") || document.body;
        revertTranslations(target);
    }
});
