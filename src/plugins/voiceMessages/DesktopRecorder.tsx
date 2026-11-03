/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { PluginNative } from "@utils/types";
import { Button, MediaEngineStore, showToast, useState } from "@webpack/common";

import type { VoiceRecorder } from ".";
import { settings } from "./settings";

const Native = VencordNative.pluginHelpers.VoiceMessages as PluginNative<typeof import("./native")>;

export const VoiceRecorderDesktop: VoiceRecorder = ({ setAudioBlob, onRecordingChange }) => {
    const [recording, setRecording] = useState(false);

    const changeRecording = (recording: boolean) => {
        setRecording(recording);
        onRecordingChange?.(recording);
    };

    function toggleRecording() {
        const discordVoice = DiscordNative.nativeModules.requireModule("discord_voice");
        const nowRecording = !recording;

        if (nowRecording) {
            discordVoice.startLocalAudioRecording(
                {
                    echoCancellation: settings.store.echoCancellation,
                    noiseCancellation: settings.store.noiseSuppression,
                    deviceId: MediaEngineStore.getInputDeviceId(),
                },
                (success: boolean) => {
                    if (success)
                        changeRecording(true);
                    else
                        showToast({ text: "Failed to start recording", variant: "critical" });
                }
            );
        } else {
            discordVoice.stopLocalAudioRecording(async (filePath: string) => {
                if (filePath) {
                    const buf = await Native.readRecording(filePath);
                    if (buf)
                        setAudioBlob(new Blob([buf], { type: "audio/ogg; codecs=opus" }));
                    else
                        showToast({ text: "Failed to finish recording", variant: "critical" });
                }
                changeRecording(false);
            });
        }
    }

    return (
        <Button onClick={toggleRecording}>
            {recording ? "Stop" : "Start"} recording
        </Button>
    );
};
