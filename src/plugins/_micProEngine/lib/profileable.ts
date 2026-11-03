/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { PluginInitializer, PluginSettings, PluginStore } from "./store";

export interface ProfileableProfile {
    name: string;
}

export interface ProfileableSettings<T extends PluginSettings = {}, B extends ProfileableProfile & T = T & ProfileableProfile> {
    currentProfile: B;
    profiles: B[];
    setCurrentProfile: (f: ((currentProfile: B) => B | undefined) | B | undefined) => void;
    getCurrentProfile: () => B;
    duplicateProfile: (profile: string | B, name: string) => void;
    deleteProfile: (profile: string | B) => void;
    saveProfile: (profile: B) => void;
    getProfile: (profile: string) => B | undefined;
    getProfiles: (defaultProfiles: boolean) => B[];
    isCurrentProfileADefaultProfile: () => boolean;
    getDefaultProfiles: () => B[];
}

export type ProfilableStore<
    T extends PluginSettings = {},
    S extends PluginSettings = {}
> = PluginStore<T & ProfileableSettings<S>>;

export type ProfilableMiddleware<
    T extends PluginSettings = {},
    S extends PluginSettings = {},
    B = T & ProfileableSettings<S>
> = PluginInitializer<T & ProfileableSettings<S>, B>;

export type ProfilableInitializer<
    T extends PluginSettings = {},
    S extends PluginSettings = {}
> = ProfilableMiddleware<T, S, T & Partial<ProfileableSettings<S>>>;

export function profileable<
    T extends PluginSettings = {},
    S extends PluginSettings = {}
>(f: ProfilableInitializer<T, S>, defaultProfile: ProfileableProfile & S, defaultProfiles: (ProfileableProfile & S)[] = []): ProfilableMiddleware<T, S> {
    return (set, get) => ({
        currentProfile: defaultProfile,
        profiles: [],
        getCurrentProfile: () => get().currentProfile,
        getProfile: (profile: string) => [...get().profiles, ...(defaultProfiles ?? [])].find(p => p.name === profile),
        deleteProfile: (profile: string | { name: string; }) => get().profiles = get().profiles.filter(p => typeof profile === "string" ? p.name !== profile : p.name !== profile.name),
        duplicateProfile: (profile: string | { name: string; }, name: string) => {
            const foundProfile = get().profiles.find(p => typeof profile === "string" ? p.name === profile : p.name === profile.name);
            if (foundProfile) {
                const cloned = { ...foundProfile, name };
                get().profiles.push(cloned);
            }
        },
        setCurrentProfile: (f: any) => {
            const currProfile = get().currentProfile;
            get().currentProfile = (typeof f === "function" ? f(currProfile) ?? currProfile : f ?? currProfile);
        },
        saveProfile: (profile: ProfileableProfile & S) => {
            get().deleteProfile(profile.name);
            get().profiles.push(profile);
        },
        isCurrentProfileADefaultProfile: () => defaultProfiles.some(profile => get().currentProfile.name === profile.name),
        getDefaultProfiles: () => defaultProfiles,
        getProfiles: (def: boolean) => [...get().profiles, ...(def ? get().getDefaultProfiles() : [])],
        ...f(set as any, get as any)
    });
}

