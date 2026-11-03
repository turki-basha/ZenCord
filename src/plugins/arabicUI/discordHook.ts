/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Logger } from "@utils/Logger";
import { i18n } from "@webpack/common";

import rawEnglishPhrases from "./data/englishPhrases.json";
import rawHashMessages from "./data/hashMessages.json";
import {
    discordIntlKeys,
    getTranslationForText
} from "./translations";

const hashMessages = rawHashMessages as Record<string, string>;
const englishPhrases = rawEnglishPhrases as Record<string, string>;

const logger = new Logger("ArabicUI.IntlHook");

type IntlFn = (...args: any[]) => any;

let originalString: IntlFn | null = null;
let originalFormat: IntlFn | null = null;
let originalT: any = null;
let isHooked = false;

function messageId(message: unknown): string | undefined {
    if (message == null) return undefined;
    if (typeof message === "string") return message;
    if (typeof message === "object") {
        const m = message as Record<string, unknown>;
        if (typeof m.id === "string") return m.id;
        if (typeof m.key === "string") return m.key;
    }
    return undefined;
}

function fillTemplate(template: string, values?: Record<string, any>): string | null {
    if (!values || !Object.keys(values).length) return template;

    let success = true;
    const result = template.replace(/\{(\w+)\}/g, (_, key: string) => {
        const val = values[key];
        if (val == null) return `{${key}}`;
        if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            return String(val);
        }
        success = false;
        return "";
    });

    return success ? result : null;
}

function translateResultString(result: any): any {
    if (typeof result === "string") {
        const trimmed = result.trim();
        if (!trimmed) return result;
        const trans = getTranslationForText(trimmed) || englishPhrases[trimmed];
        if (trans) return trans;
        return result;
    }
    if (Array.isArray(result)) {
        return result.map(v => translateResultString(v));
    }
    return result;
}

function wrapCallable(fn: Function) {
    return function (this: any, ...args: any[]) {
        const res = fn.apply(this, args);
        return translateResultString(res);
    };
}

export function installDiscordHook(): boolean {
    if (isHooked) return true;

    const intl = (i18n as any)?.intl;
    if (!intl || typeof intl.string !== "function" || typeof intl.format !== "function") {
        logger.warn("i18n.intl not ready yet; will retry on DOM load");
        return false;
    }

    originalString = intl.string.bind(intl);
    originalFormat = intl.format.bind(intl);

    intl.string = (message: unknown) => {
        const id = messageId(message);
        if (id) {
            if (discordIntlKeys[id]) return discordIntlKeys[id];
            if (hashMessages[id]) return hashMessages[id];
        }

        if (message && typeof message === "object") {
            const m = message as Record<string, any>;
            const defaultMsg = m.defaultMessage || m.message;
            if (typeof defaultMsg === "string") {
                const arabic = getTranslationForText(defaultMsg) || englishPhrases[defaultMsg.trim()];
                if (arabic) {
                    const cloned = { ...m, defaultMessage: arabic, message: arabic };
                    return originalString!(cloned);
                }
            }
        }

        const englishResult = originalString!(message);
        return translateResultString(englishResult);
    };

    intl.format = (message: unknown, values?: Record<string, any>) => {
        const id = messageId(message);
        const template = (id && (discordIntlKeys[id] || hashMessages[id])) || undefined;
        if (template) {
            const filled = fillTemplate(template, values);
            if (filled != null) return filled;

            if (message && typeof message === "object") {
                const m = message as Record<string, any>;
                const cloned = { ...m, defaultMessage: template, message: template };
                return translateResultString(originalFormat!(cloned, values));
            }
        }

        let defaultMsg: string | undefined;
        if (message && typeof message === "object") {
            const m = message as Record<string, any>;
            if (typeof m.defaultMessage === "string") defaultMsg = m.defaultMessage;
            else if (typeof m.message === "string") defaultMsg = m.message;
        }

        if (!defaultMsg && originalString) {
            try {
                const resolved = originalString(message);
                if (typeof resolved === "string") defaultMsg = resolved;
            } catch {
                // ignore
            }
        }

        if (typeof defaultMsg === "string") {
            const arabic = getTranslationForText(defaultMsg) || englishPhrases[defaultMsg.trim()];
            if (arabic) {
                const filled = fillTemplate(arabic, values);
                if (filled != null) return filled;

                if (message && typeof message === "object") {
                    const m = message as Record<string, any>;
                    const cloned = { ...m, defaultMessage: arabic, message: arabic };
                    return translateResultString(originalFormat!(cloned, values));
                }
                return translateResultString(originalFormat!(message, values));
            }
        }

        return translateResultString(originalFormat!(message, values));
    };

    if ((i18n as any).t && originalT == null) {
        originalT = (i18n as any).t;
        (i18n as any).t = new Proxy(originalT, {
            get(target, prop, receiver) {
                const val = Reflect.get(target, prop, receiver);
                if (typeof val === "function") {
                    return wrapCallable(val);
                }
                return val;
            }
        });
    }

    isHooked = true;
    logger.info("Discord intl native hook installed successfully with full hash & phrase maps");
    return true;
}

export function uninstallDiscordHook(): void {
    if (!isHooked) return;

    const intl = (i18n as any)?.intl;
    if (intl) {
        if (originalString) intl.string = originalString;
        if (originalFormat) intl.format = originalFormat;
    }
    if (originalT && (i18n as any).t) {
        (i18n as any).t = originalT;
    }

    originalString = null;
    originalFormat = null;
    originalT = null;
    isHooked = false;
    logger.info("Discord intl native hook uninstalled");
}
