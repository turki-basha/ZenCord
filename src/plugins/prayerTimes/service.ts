/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { HijriDateInfo, PrayerData, PrayerTimings } from "./types";

const CACHE_KEY = "zc_prayer_times_cache";

/**
 * Format 24h time string "HH:MM" to 12h or 24h display string
 */
export function formatPrayerTime(timeStr: string, is24h: boolean, isArabic: boolean): string {
    if (!timeStr) return "";
    const clean = timeStr.split(" ")[0]; // remove timezone string if any
    const [hStr, mStr] = clean.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr || "00";

    if (is24h) {
        return `${String(h).padStart(2, "0")}:${m}`;
    }

    const isPM = h >= 12;
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;

    const period = isArabic ? (isPM ? "م" : "ص") : (isPM ? "PM" : "AM");
    return `${h}:${m} ${period}`;
}

/**
 * Approximate offline Hijri Date calculation fallback
 */
function getOfflineHijriDate(date: Date): HijriDateInfo {
    try {
        // Intl DateTimeFormat islamic-umalqura
        const formatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long"
        });
        const parts = formatter.formatToParts(date);
        const day = parts.find(p => p.type === "day")?.value || String(date.getDate());
        const monthAr = parts.find(p => p.type === "month")?.value || "رجب";
        const year = parts.find(p => p.type === "year")?.value || "1447";
        const weekdayAr = parts.find(p => p.type === "weekday")?.value || "";

        return {
            day,
            month: { ar: monthAr, en: monthAr },
            year,
            designation: "هـ",
            weekday: { ar: weekdayAr, en: weekdayAr }
        };
    } catch {
        return {
            day: "15",
            month: { ar: "رجب", en: "Rajab" },
            year: "1447",
            designation: "هـ",
            weekday: { ar: "الأربعاء", en: "Wednesday" }
        };
    }
}

/**
 * Offline fallback times for Riyadh / Default city if offline
 */
function getOfflineFallbackTimings(): PrayerTimings {
    return {
        Fajr: "05:08",
        Sunrise: "06:27",
        Dhuhr: "11:58",
        Asr: "15:14",
        Maghrib: "17:42",
        Isha: "19:12"
    };
}

/**
 * Fetch prayer times from AlAdhan API with local caching and offline fallback
 */
export async function getPrayerTimes(city: string, country: string, method: string): Promise<PrayerData> {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}_${city}_${country}_${method}`;

    // Check localStorage cache
    try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            if (cached.dateKey === dateKey && cached.data) {
                return cached.data;
            }
        }
    } catch { }

    try {
        const cleanCity = encodeURIComponent(city.trim() || "Riyadh");
        const cleanCountry = encodeURIComponent(country.trim() || "Saudi Arabia");
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${cleanCity}&country=${cleanCountry}&method=${method}`;

        const res = await fetch(url, { cache: "force-cache" });
        if (!res.ok) throw new Error("Network response not ok");

        const json = await res.json();
        if (json.code === 200 && json.data) {
            const t = json.data.timings;
            const h = json.data.date.hijri;

            const prayerData: PrayerData = {
                timings: {
                    Fajr: t.Fajr,
                    Sunrise: t.Sunrise,
                    Dhuhr: t.Dhuhr,
                    Asr: t.Asr,
                    Maghrib: t.Maghrib,
                    Isha: t.Isha
                },
                hijri: {
                    day: h.day,
                    month: {
                        ar: h.month.ar,
                        en: h.month.en
                    },
                    year: h.year,
                    designation: h.designation.abbreviated || "هـ",
                    weekday: {
                        ar: h.weekday.ar,
                        en: h.weekday.en
                    }
                },
                dateReadable: json.data.date.readable
            };

            // Save cache
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({ dateKey, data: prayerData }));
            } catch { }

            return prayerData;
        }
    } catch {
        // Fallback on error or offline
    }

    return {
        timings: getOfflineFallbackTimings(),
        hijri: getOfflineHijriDate(today),
        dateReadable: today.toLocaleDateString()
    };
}

/**
 * Determine next prayer and minutes remaining
 */
export function getNextPrayer(timings: PrayerTimings): {
    name: "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
    time: string;
    minutesLeft: number;
    hoursLeft: number;
} {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const order: ("Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha")[] = [
        "Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"
    ];

    for (const prayer of order) {
        const timeStr = timings[prayer];
        if (!timeStr) continue;
        const [h, m] = timeStr.split(" ")[0].split(":").map(Number);
        const prayerMinutes = h * 60 + m;

        if (prayerMinutes > currentMinutes) {
            const diff = prayerMinutes - currentMinutes;
            return {
                name: prayer,
                time: timeStr,
                minutesLeft: diff % 60,
                hoursLeft: Math.floor(diff / 60)
            };
        }
    }

    // If past Isha, next is tomorrow's Fajr
    const [fajrH, fajrM] = (timings.Fajr || "05:08").split(" ")[0].split(":").map(Number);
    const fajrMinutesTomorrow = 24 * 60 - currentMinutes + (fajrH * 60 + fajrM);

    return {
        name: "Fajr",
        time: timings.Fajr,
        minutesLeft: fajrMinutesTomorrow % 60,
        hoursLeft: Math.floor(fajrMinutesTomorrow / 60)
    };
}
