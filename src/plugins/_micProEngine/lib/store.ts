/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "@api/Settings";

export type PluginSettings = {
    [key: string]: any;
};

export type PluginUse<Z extends PluginSettings> = () => Z;
export type PluginGet<Z extends PluginSettings> = () => Z;
export type PluginSet<Z extends PluginSettings> = (s: Z | ((settings: Z) => Z | undefined)) => Z;
export type PluginInitializer<Z extends PluginSettings, T = Z> = (set: PluginSet<Z>, get: PluginGet<Z>) => T;
export interface PluginStore<Z extends PluginSettings> {
    use: PluginUse<Z>;
    get: PluginGet<Z>;
    set: PluginSet<Z>;
}

function createObjectProxy<T extends object>(obj1: T, onUpdate: (updatedObject: T) => void): T {
    const handler: ProxyHandler<T> = {
        set(target, property, value, receiver) {
            const success = Reflect.set(target, property, value, receiver);
            const nestedObj = (target as any)[property];

            if (typeof nestedObj === "object" && nestedObj !== null) {
                (target as any)[property] = createObjectProxy(nestedObj, () => { onUpdate(obj1); });
            }

            onUpdate(obj1);
            return success;
        }
    };

    return new Proxy(obj1, handler);
}

const startupStates: Record<string, boolean> = {};
const settingStorage = new Map<string, any>();

export function createPluginStore<Z extends PluginSettings = {}>(pluginName: string, storeName: string, f: PluginInitializer<Z>): PluginStore<Z> {
    const plugins = Settings.plugins as Record<string, any>;
    if (!plugins[pluginName])
        plugins[pluginName] = {};

    if (!plugins[pluginName].stores)
        plugins[pluginName].stores = {};

    if (!plugins[pluginName].stores[storeName])
        plugins[pluginName].stores[storeName] = {};

    const get: PluginGet<Z> = () => {
        let storeSettings = settingStorage.get(storeName);
        if (!storeSettings) {
            storeSettings = f(set, get);
            settingStorage.set(storeName, storeSettings);
        }
        if (!startupStates[storeName]) {
            const startupInfo = plugins[pluginName].stores[storeName];
            storeSettings.simpleMode = startupInfo.simpleMode;
            storeSettings.profiles = startupInfo.profiles || [];
            storeSettings.currentProfile = startupInfo.currentProfile || { name: "" };
            startupStates[storeName] = true;
        }

        return storeSettings;
    };

    const set: PluginSet<Z> = s => {
        const current = get();
        const updated = typeof s === "function" ? (s as any)(current) ?? current : s;
        settingStorage.set(storeName, updated);
        plugins[pluginName].stores[storeName] = updated;
        return updated;
    };

    return {
        get,
        set,
        use: () => get()
    };
}

