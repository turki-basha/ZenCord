/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { Logger } from "@utils/Logger";
import { NavigationRouter } from "@webpack/common/utils";

import { normalizeQuestName } from "./filtering";
import type { Quest } from "./types";
import { QUEST_PAGE } from "./ui";

const LOG = new Logger("ZenQuests");

export function getFormattedNow(): string {
    return new Date().toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    }).replace(",", "");
}

function getZenQuestsLogPrefix(source: string): string {
    return `[${getFormattedNow()}] [${source}]\n`;
}

function emitZenQuestsLog(level: string, source: string, ...args: unknown[]): void {
    const prefix = args.length ? getZenQuestsLogPrefix(source) : getZenQuestsLogPrefix(source).trim();

    switch (level) {
        case "debug":
            LOG.debug(prefix, ...args);

            return;
        case "error":
            LOG.error(prefix, ...args);

            return;
        case "info":
            LOG.info(prefix, ...args);

            return;
        case "warn":
            LOG.warn(prefix, ...args);

            return;
        default:
            LOG.log(prefix, ...args);

            return;
    }
}

export const QL = {
    log(source: string, ...args: unknown[]): void { emitZenQuestsLog("log", source, ...args); },
    info(source: string, ...args: unknown[]): void { emitZenQuestsLog("info", source, ...args); },
    warn(source: string, ...args: unknown[]): void { emitZenQuestsLog("warn", source, ...args); },
    error(source: string, ...args: unknown[]): void { emitZenQuestsLog("error", source, ...args); },
    debug(source: string, ...args: unknown[]): void { emitZenQuestsLog("debug", source, ...args); },
};

export function notifyQuestCompletion(quest?: Quest): void {
    if (!quest) return;

    showNotification({
        title: "Quest Completed!",
        body: `The ${normalizeQuestName(quest)} Quest has completed.`,
        dismissOnClick: true,
        onClick: () => NavigationRouter.transitionTo(`${QUEST_PAGE}#${quest.id}`)
    });

    QL.log("NOTIFY_QUEST_COMPLETION", { quest });
}
