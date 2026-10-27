/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type VoiceStateKey = "selfMute" | "selfDeaf" | "selfVideo";

export interface FakeVoiceFlags {
    selfMute: boolean;
    selfDeaf: boolean;
    selfVideo: boolean;
}

export interface VoiceStatePayload {
    guildId?: string | null;
    channelId?: string | null;
    selfMute?: boolean;
    selfDeaf?: boolean;
    selfVideo?: boolean;
    [key: string]: unknown;
}

export function createDefaultFlags(): FakeVoiceFlags {
    return { selfMute: false, selfDeaf: false, selfVideo: false };
}

export function applyOverrides(
    original: VoiceStatePayload,
    flags: Readonly<FakeVoiceFlags>,
    autoMute: boolean
): VoiceStatePayload {
    const result = { ...original };
    if (flags.selfMute) result.selfMute = true;
    if (flags.selfDeaf) {
        result.selfDeaf = true;
        if (autoMute) result.selfMute = true;
    }
    if (flags.selfVideo) result.selfVideo = true;
    return result;
}
