/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { MicrophoneProfile, MicrophoneStore } from "@plugins/_micProEngine/stores/microphoneStore";
import { Logger } from "@utils/Logger";

import type { ProfilableStore } from "./profileable";
import type { types } from "./types";

export function getDefaultAudioTransportationOptions(connection: types.Connection) {
    return {
        audioEncoder: { ...connection.getCodecOptions("opus").audioEncoder },
        encodingVoiceBitRate: 64000
    };
}

export function getReplaceableAudioTransportationOptions(
    connection: types.Connection,
    get: ProfilableStore<MicrophoneStore, MicrophoneProfile>["get"]
) {
    const { currentProfile } = get();
    const { channels, channelsEnabled, freq, freqEnabled, pacsize, pacsizeEnabled, rate, rateEnabled, voiceBitrate, voiceBitrateEnabled } = currentProfile;
    return {
        ...(voiceBitrateEnabled && voiceBitrate ? { encodingVoiceBitRate: voiceBitrate * 1000 } : {}),
        audioEncoder: {
            ...connection.getCodecOptions("opus").audioEncoder,
            ...(rateEnabled && rate ? { rate } : {}),
            ...(pacsizeEnabled && pacsize ? { pacsize } : {}),
            ...(freqEnabled && freq ? { freq } : {}),
            ...(channelsEnabled && channels ? { channels } : { channels: 1 })
        }
    };
}

export function patchConnectionAudioTransportOptions(
    connection: types.Connection,
    get: ProfilableStore<MicrophoneStore, MicrophoneProfile>["get"],
    logger?: Logger
) {
    const oldSetTransportOptions = connection.conn.setTransportOptions;

    connection.conn.setTransportOptions = function (this: any, options: Record<string, any>) {
        const replaceable = getReplaceableAudioTransportationOptions(connection, get);
        if (replaceable.encodingVoiceBitRate !== undefined) options.encodingVoiceBitRate = replaceable.encodingVoiceBitRate;
        if (!options.audioEncoder) options.audioEncoder = {};
        Object.assign(options.audioEncoder, replaceable.audioEncoder);
        return Reflect.apply(oldSetTransportOptions, this, [options]);
    };

    const forceUpdateTransportationOptions = () => {
        const transportOptions = Object.assign(
            {},
            getDefaultAudioTransportationOptions(connection),
            getReplaceableAudioTransportationOptions(connection, get)
        );
        logger?.info("Overridden Transport Options", transportOptions);
        oldSetTransportOptions(transportOptions);
    };

    return { oldSetTransportOptions, forceUpdateTransportationOptions };
}
