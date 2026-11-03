/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import { useTimer } from "@utils/react";
import { formatDuration } from "@utils/text";
import definePlugin, { OptionType } from "@utils/types";
import { React } from "@webpack/common";

import alignedChatInputFix from "./alignedChatInputFix.css?managed";

const settings = definePluginSettings({
    format: {
        type: OptionType.SELECT,
        description: "The timer format. This can be any valid moment.js format",
        options: [
            {
                label: "30d 23:00:42",
                value: "stopwatch",
                default: true
            },
            {
                label: "30d 23h 00m 42s",
                value: "human"
            }
        ] as const
    }
});



export default definePlugin({
    name: "CallTimer",
    description: "Adds a timer to vcs",
    tags: ["Voice", "Utility"],
    authors: [Devs.Ven],
    managedStyle: alignedChatInputFix,
    settings,

    startTime: 0,
    interval: void 0 as NodeJS.Timeout | undefined,

    patches: [
        {
            find: '"RTCConnectionMenu"',
            replacement: {
                match: /("RTCConnectionMenu".{0,300}?lineClamp:1,children:)(\i)(?=,|}\))/,
                replace: "$1[$2,$self.renderTimer({ channelId: this?.props?.channel?.id })]"
            }
        },
    ],

    renderTimer: ErrorBoundary.wrap(({ channelId }: { channelId: string; }) => {
        const time = useTimer({ deps: [channelId] });

        return (
            <p style={{ margin: 0, fontFamily: "var(--font-code)" }}>
                {formatDuration(time, settings.store.format === "human")}
            </p>
        );
    }, { noop: true }),
});
