/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings, useSettings } from "@api/Settings";
import { UserStore } from "@webpack/common";

export const ZENQUESTS_PLUGIN_NAME = "ZenQuests";

interface ZenQuestsSettingsOverrides {
    ignoredQuestIDs: Record<string, string[]>;
    resumeQuestIDs: Record<string, { timestamp: number, questIDs: string[]; }>;
}

type ZenQuestsSettings = Settings["plugins"][typeof ZENQUESTS_PLUGIN_NAME] & ZenQuestsSettingsOverrides;

export function getZenQuestsSettings(): ZenQuestsSettings {
    return Settings.plugins[ZENQUESTS_PLUGIN_NAME] as ZenQuestsSettings;
}

export function useZenQuestsSettings<K extends keyof ZenQuestsSettings & string>(keys: readonly K[]): Pick<ZenQuestsSettings, K> {
    return useSettings(keys.map(key => `plugins.${ZENQUESTS_PLUGIN_NAME}.${key}`) as any).plugins[ZENQUESTS_PLUGIN_NAME] as unknown as Pick<ZenQuestsSettings, K>;
}

export function getCurrentUserId(userId?: string): string | null {
    return userId ?? UserStore.getCurrentUser()?.id ?? null;
}
