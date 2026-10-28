/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export interface HijriDateInfo {
    day: string;
    month: {
        en: string;
        ar: string;
    };
    year: string;
    designation: string;
    weekday: {
        en: string;
        ar: string;
    };
}

export interface PrayerData {
    timings: PrayerTimings;
    hijri: HijriDateInfo;
    dateReadable: string;
}

export const CALCULATION_METHODS = [
    { label: "أم القرى (مكة المكرمة) - Umm Al-Qura", value: "4" },
    { label: "الهيئة المصرية العامة للمساحة - Egyptian General Authority", value: "5" },
    { label: "رابطة العالم الإسلامي - Muslim World League", value: "3" },
    { label: "جامعة العلوم الإسلامية (كراتشي) - Karachi", value: "1" },
    { label: "الجمعية الإسلامية لأمريكا الشمالية (ISNA)", value: "2" },
    { label: "رئاسة الشؤون الدينية (تركيا) - Diyanet", value: "13" },
    { label: "الاتحاد الإسلامي في فرنسا (UOIF)", value: "12" },
    { label: "دائرة الشؤون الإسلامية (دبي) - Dubai", value: "16" },
    { label: "وزارة الأوقاف (الكويت) - Kuwait", value: "9" }
] as const;

export const PRAYER_NAMES: Record<string, { ar: string; en: string; icon: string }> = {
    Fajr: { ar: "الفجر", en: "Fajr", icon: "🌅" },
    Sunrise: { ar: "الشروق", en: "Sunrise", icon: "☀️" },
    Dhuhr: { ar: "الظهر", en: "Dhuhr", icon: "☀️" },
    Asr: { ar: "العصر", en: "Asr", icon: "🌤️" },
    Maghrib: { ar: "المغرب", en: "Maghrib", icon: "🌇" },
    Isha: { ar: "العشاء", en: "Isha", icon: "🌙" }
};
