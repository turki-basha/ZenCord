/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { CALCULATION_METHODS } from "./types";

export const settings = definePluginSettings({
    city: {
        type: OptionType.STRING,
        description: "المدينة لحساب مواعيد الصلاة (City)",
        default: "Riyadh"
    },
    country: {
        type: OptionType.STRING,
        description: "الدولة (Country)",
        default: "Saudi Arabia"
    },
    calculationMethod: {
        type: OptionType.SELECT,
        description: "طريقة حساب المواقيت الفقهية (Calculation Method)",
        options: CALCULATION_METHODS.map(m => ({
            label: m.label,
            value: m.value,
            default: m.value === "4"
        }))
    },
    format24h: {
        type: OptionType.BOOLEAN,
        description: "استخدام نظام 24 ساعة بدلاً من 12 ساعة (24-Hour Clock)",
        default: false
    },
    showArabic: {
        type: OptionType.BOOLEAN,
        description: "عرض الأسماء والتواريخ بالعربية (Arabic Language Display)",
        default: true
    },
    showNextPrayerCountdown: {
        type: OptionType.BOOLEAN,
        description: "إظهار العداد التنازلي المتبقي في الهيدر (Show Countdown in Header)",
        default: true
    }
});
