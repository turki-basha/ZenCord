/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

import { PrayerTimesWidget } from "./PrayerTimesWidget";
import { settings } from "./settings";

export default definePlugin({
    name: "PrayerTimes",
    description: "عرض مواقيت الصلاة الدقيقة والتاريخ الهجري في الهيدر العلوي بأسلوب أنيق وخفيف (Prayer Times & Hijri Calendar Header)",
    tags: ["Utility", "Arabic"],
    authors: [
        {
            name: "ZenCord Team",
            id: 853046251465343027n
        }
    ],
    enabledByDefault: true,
    settings,

    PrayerTimesWidget
});

export { PrayerTimesWidget };
