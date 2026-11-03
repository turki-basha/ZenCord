/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, findOption, OptionalMessageOption, sendBotMessage } from "@api/Commands";
import { Devs } from "@utils/constants";
import { sendMessage } from "@utils/discord";
import definePlugin from "@utils/types";
import { FluxDispatcher, MessageActions, PendingReplyStore, SpotifyStore } from "@webpack/common";
import { Command, SpotifyTrack } from "@zencord/discord-types";

function makeCommand(name: string, formatUrl: (track: SpotifyTrack) => string): Command {
    return {
        name,
        description: `Share your current Spotify ${name} in chat`,
        inputType: ApplicationCommandInputType.BUILT_IN,
        options: [OptionalMessageOption],
        execute(options, { channel }) {
            const track = SpotifyStore.getTrack();
            if (!track) {
                return sendBotMessage(channel.id, {
                    content: "You're not listening to any music."
                });
            }

            // local tracks have an id of null
            if (track.id == null) {
                return sendBotMessage(channel.id, {
                    content: "Failed to find the track on spotify."
                });
            }

            const data = formatUrl(track);
            const message = findOption(options, "message");

            // Note: Due to how Discord handles commands, we need to manually create and send the message

            sendMessage(
                channel.id,
                { content: message ? `${message} ${data}` : data },
                false,
                MessageActions.getSendMessageOptionsForReply(PendingReplyStore.getPendingReply(channel.id))
            ).then(() => {
                FluxDispatcher.dispatch({ type: "DELETE_PENDING_REPLY", channelId: channel.id });
            });

        }
    };
}

export default definePlugin({
    name: "SpotifyShareCommands",
    description: "Share your current Spotify track, album or artist via slash command (/track, /album, /artist)",
    tags: ["Media", "Commands"],
    authors: [Devs.katlyn],
    commands: [
        makeCommand("track", track => `https://open.spotify.com/track/${track.id}`),
        makeCommand("album", track => `https://open.spotify.com/album/${track.album.id}`),
        makeCommand("artist", track => track.artists[0].external_urls.spotify)
    ]
});
