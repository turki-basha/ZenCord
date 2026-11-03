/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { plugins } from "@api/PluginManager";
import { OptionType, type Plugin } from "@utils/types";

import rawPacks from "./data/pluginPacks.json";

export interface PluginLocalePack {
    name?: string;
    description?: string;
    settings?: Record<string, string>;
}

const packs = rawPacks as Record<string, PluginLocalePack>;

interface Backup {
    description: string;
    settings: Record<string, { description?: string; displayName?: string }>;
}

const backups = new Map<string, Backup>();
let overlayActive = false;

function backupAndApply(plugin: Plugin, pack: PluginLocalePack) {
    if (backups.has(plugin.name)) return;

    const settingsBackup: Backup["settings"] = {};
    const def = plugin.settings?.def;
    if (def && pack.settings) {
        for (const [key, arabic] of Object.entries(pack.settings)) {
            const opt = (def as Record<string, any>)[key];
            if (!opt || opt.type === OptionType.CUSTOM) continue;
            settingsBackup[key] = {
                description: "description" in opt ? opt.description : undefined,
                displayName: "displayName" in opt ? opt.displayName : undefined,
            };
            if ("description" in opt) opt.description = arabic;
            if ("displayName" in opt && opt.displayName != null) opt.displayName = arabic;
        }
    }

    backups.set(plugin.name, {
        description: plugin.description,
        settings: settingsBackup,
    });

    if (pack.description) plugin.description = pack.description;
}

function restore(plugin: Plugin) {
    const bak = backups.get(plugin.name);
    if (!bak) return;

    plugin.description = bak.description;
    const def = plugin.settings?.def;
    if (def) {
        for (const [key, prev] of Object.entries(bak.settings)) {
            const opt = (def as Record<string, any>)[key];
            if (!opt || opt.type === OptionType.CUSTOM) continue;
            if (prev.description !== undefined && "description" in opt) {
                opt.description = prev.description;
            }
            if (prev.displayName !== undefined && "displayName" in opt) {
                opt.displayName = prev.displayName;
            }
        }
    }

    backups.delete(plugin.name);
}

export function applyPluginOverlay() {
    if (overlayActive) return;
    overlayActive = true;

    for (const plugin of Object.values(plugins)) {
        const pack = packs[plugin.name];
        if (!pack) continue;
        try {
            backupAndApply(plugin, pack);
        } catch {
            // ignore individual plugin apply errors
        }
    }
}

export function removePluginOverlay() {
    if (!overlayActive) return;

    for (const plugin of Object.values(plugins)) {
        try {
            restore(plugin);
        } catch {
            // ignore
        }
    }

    backups.clear();
    overlayActive = false;
}

