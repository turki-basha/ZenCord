/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

import { PrayerTimesWidget } from "./PrayerTimesWidget";
import { settings } from "./settings";

export default definePlugin({
    name: "PrayerTimes",
    description: "عرض مواقيت الصلاة الدقيقة والتاريخ الهجري في الهيدر العلوي بأسلوب أنيق وخفيف (Prayer Times & Hijri Calendar Header)",
    tags: ["Utility", "Arabic"],
    authors: [Devs.ZenCord],
    enabledByDefault: true,
    requiresRestart: true,
    settings,

    patches: [
        {
            find: '?"BACK_FORWARD_NAVIGATION":',
            replacement: {
                match: /(trailing:.{0,100}?children:\[)/,
                replace: "$1$self.renderHeaderPrayerWidget(),"
            }
        }
    ],

    renderHeaderPrayerWidget() {
        return (
            <ErrorBoundary key="zc-prayer-times" noop>
                <PrayerTimesWidget />
            </ErrorBoundary>
        );
    },

    PrayerTimesWidget
});

export { PrayerTimesWidget };
