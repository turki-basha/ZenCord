/*
 * ZenCord, a modification for Discord
 * Copyright (c) 2026 ZenCord Team & Contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { sleep } from "@utils/misc";
import { findByPropsLazy } from "@webpack";
import { ChannelStore, MediaEngineStore, NotificationSettingsStore, SelectedChannelStore } from "@webpack/common";
import { FakeVoiceFlags } from "./types";

const MediaEngineActions = findByPropsLazy("toggleSelfMute");
const gatewayModule = findByPropsLazy("getSocket");

export class VoiceStateService {
    private updating = false;
    private aborted = false;

    public sendGatewayUpdate(flags: FakeVoiceFlags, autoMute: boolean): boolean {
        try {
            const socket = (gatewayModule as any)?.getSocket?.();
            const channelId = SelectedChannelStore.getVoiceChannelId();
            const channel = channelId ? ChannelStore.getChannel(channelId) : null;
            if (socket && channelId) {
                socket.send(4, {
                    guild_id: channel?.guild_id ?? null,
                    channel_id: channelId,
                    self_mute: flags.selfMute || (flags.selfDeaf && autoMute) || (MediaEngineStore?.isMute?.() ?? false),
                    self_deaf: flags.selfDeaf || (MediaEngineStore?.isDeaf?.() ?? false),
                    self_video: flags.selfVideo ?? false,
                    flags: 0
                });
                return true;
            }
        } catch (error) {
            console.error("[FakeDeafen] Direct gateway socket send failed:", error);
        }
        return false;
    }

    public async triggerUpdate(flags?: FakeVoiceFlags, autoMute = true): Promise<void> {
        if (this.aborted) return;

        // Try direct gateway socket update first
        if (flags && this.sendGatewayUpdate(flags, autoMute)) {
            return;
        }

        // Fallback: seamless double toggle
        if (this.updating) return;
        this.updating = true;

        const state = (NotificationSettingsStore as any)?.getState?.();
        const oldDisabled = state?.disabledSounds ? [...state.disabledSounds] : [];

        if (state?.disabledSounds) {
            const sounds = new Set(state.disabledSounds);
            if (!sounds.has("mute")) state.disabledSounds.push("mute");
            if (!sounds.has("unmute")) state.disabledSounds.push("unmute");
        }

        try {
            await sleep(50);
            if (this.aborted) return;

            await (MediaEngineActions as any)?.toggleSelfMute?.();

            await sleep(100);
            if (this.aborted) return;

            await (MediaEngineActions as any)?.toggleSelfMute?.();
        } catch (error) {
            console.error("[FakeDeafen] Voice state toggle fallback failed:", error);
        } finally {
            if (state && state.disabledSounds) {
                state.disabledSounds = oldDisabled;
            }
            this.updating = false;
        }
    }

    public dispose(): void {
        this.aborted = true;
        this.updating = false;
    }
}
