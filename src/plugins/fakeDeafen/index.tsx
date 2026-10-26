/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, sendBotMessage } from "@api/Commands";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { Menu, React, showToast } from "@webpack/common";

import { VoiceStateService } from "./service";
import { applyOverrides, createDefaultFlags, FakeVoiceFlags, VoiceStateKey, VoiceStatePayload } from "./types";

export const settings = definePluginSettings({
    autoMute: {
        description: "Automatically fake mute whenever Fake Deafen is enabled",
        type: OptionType.BOOLEAN,
        default: true
    },
    showToasts: {
        description: "Show a quick popup toast notification when toggling fake states",
        type: OptionType.BOOLEAN,
        default: true
    }
});

let service: VoiceStateService | null = null;
let flags: FakeVoiceFlags = createDefaultFlags();

function notifyStatus(name: string, enabled: boolean) {
    if (!settings.store.showToasts) return;
    showToast({
        text: `${name} ${enabled ? "Enabled" : "Disabled"}!`,
        variant: enabled ? "success" : undefined
    });
}

function handleToggle(key: VoiceStateKey): void {
    flags[key] = !flags[key];
    const isNowEnabled = flags[key];

    const labelMap: Record<VoiceStateKey, string> = {
        selfDeaf: "Fake Deafen",
        selfMute: "Fake Mute",
        selfVideo: "Fake Video"
    };

    notifyStatus(labelMap[key], isNowEnabled);
    void service?.triggerUpdate(flags, settings.store.autoMute);
}

export default definePlugin({
    name: "FakeDeafen",
    description: "Pretend to be deafened or muted in voice channels while secretly hearing everything and speaking freely",
    authors: [{ name: "ZenCord Team", id: 0n }],
    tags: ["Voice", "Privacy", "Utility"],

    settings,

    contextMenus: {
        "audio-device-context"(children, data) {
            if (data?.renderInputDevices) {
                children.push(
                    <Menu.MenuSeparator />,
                    <Menu.MenuCheckboxItem
                        id="fake-mute"
                        label="Fake Mute"
                        checked={flags.selfMute}
                        action={() => handleToggle("selfMute")}
                    />
                );
            }

            if (data?.renderOutputDevices) {
                children.push(
                    <Menu.MenuSeparator />,
                    <Menu.MenuCheckboxItem
                        id="fake-deafen"
                        label="Fake Deafen"
                        checked={flags.selfDeaf}
                        action={() => handleToggle("selfDeaf")}
                    />
                );
            }
        },

        "video-device-context"(children) {
            children.push(
                <Menu.MenuSeparator />,
                <Menu.MenuCheckboxItem
                    id="fake-video"
                    label="Fake Video"
                    checked={flags.selfVideo}
                    action={() => handleToggle("selfVideo")}
                />
            );
        }
    },

    commands: [
        {
            name: "fakedeafen",
            description: "Toggle Fake Deafen state (appear deafened while hearing all audio)",
            inputType: ApplicationCommandInputType.BUILT_IN,
            execute: async (_args, ctx) => {
                handleToggle("selfDeaf");
                sendBotMessage(ctx.channel.id, {
                    content: `🎧 **Fake Deafen** is now **${flags.selfDeaf ? "ENABLED" : "DISABLED"}**.`
                });
            }
        },
        {
            name: "fakemute",
            description: "Toggle Fake Mute state (appear muted while still transmitting mic audio)",
            inputType: ApplicationCommandInputType.BUILT_IN,
            execute: async (_args, ctx) => {
                handleToggle("selfMute");
                sendBotMessage(ctx.channel.id, {
                    content: `🎙️ **Fake Mute** is now **${flags.selfMute ? "ENABLED" : "DISABLED"}**.`
                });
            }
        }
    ],

    modifyVoiceState(voiceState: VoiceStatePayload): VoiceStatePayload {
        return applyOverrides(voiceState, flags, settings.store.autoMute);
    },

    patches: [
        {
            find: "voiceServerPing(){",
            replacement: [
                {
                    match: /voiceStateUpdate\((\w+)\){(.{0,10})guildId:/,
                    replace: "voiceStateUpdate($1){$1=$self.modifyVoiceState($1);$2guildId:"
                }
            ]
        }
    ],

    start() {
        flags = createDefaultFlags();
        service = new VoiceStateService();
    },

    stop() {
        if (service) {
            service.dispose();
            service = null;
        }
        flags = createDefaultFlags();
    }
});
