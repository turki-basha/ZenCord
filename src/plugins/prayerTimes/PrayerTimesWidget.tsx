/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { Flex } from "@components/Flex";
import { Popout, useEffect, useRef, useState } from "@webpack/common";
import React from "react";

import { formatPrayerTime, getNextPrayer, getOfflineFallbackTimings, getOfflineHijriDate, getPrayerTimes } from "./service";
import { settings } from "./settings";
import { PRAYER_NAMES, PrayerData } from "./types";

export function PrayerTimesWidget() {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [showPopout, setShowPopout] = useState(false);
    const [data, setData] = useState<PrayerData>(() => {
        const now = new Date();
        return {
            timings: getOfflineFallbackTimings(),
            hijri: getOfflineHijriDate(now),
            dateReadable: now.toDateString()
        };
    });

    let s: any = {};
    try {
        s = settings.use([
            "city",
            "country",
            "calculationMethod",
            "format24h",
            "showArabic",
            "showNextPrayerCountdown"
        ]) || {};
    } catch {
        s = {};
    }

    const city = s.city || "Riyadh";
    const country = s.country || "Saudi Arabia";
    const calculationMethod = s.calculationMethod || "4";
    const isArabic = s.showArabic !== false;
    const is24h = Boolean(s.format24h);
    const showCountdown = s.showNextPrayerCountdown !== false;

    const loadData = async () => {
        try {
            const result = await getPrayerTimes(city, country, calculationMethod);
            if (result && result.timings) {
                setData(result);
            }
        } catch { }
    };

    useEffect(() => {
        loadData();
        // Refresh every 30 minutes
        const interval = setInterval(loadData, 1000 * 60 * 30);
        return () => clearInterval(interval);
    }, [city, country, calculationMethod]);

    const next = getNextPrayer(data.timings);
    const nextMeta = PRAYER_NAMES[next.name] || { ar: next.name, en: next.name, icon: "🕌" };
    const prayerDisplayName = isArabic ? nextMeta.ar : nextMeta.en;
    const formattedNextTime = formatPrayerTime(next.time, is24h, isArabic);

    const countdownText = next.hoursLeft > 0
        ? (isArabic ? `${next.hoursLeft} س و ${next.minutesLeft} د` : `${next.hoursLeft}h ${next.minutesLeft}m`)
        : (isArabic ? `${next.minutesLeft} د` : `${next.minutesLeft}m`);

    const renderPopoutContent = () => {
        const prayersList = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

        return (
            <div className="zc-prayer-popout" dir={isArabic ? "rtl" : "ltr"}>
                {/* Header: Hijri Date & Location */}
                <div className="zc-prayer-popout-header">
                    <div className="zc-prayer-popout-date">
                        <span className="zc-prayer-popout-icon">🕌</span>
                        <span>
                            {data.hijri.weekday ? (isArabic ? data.hijri.weekday.ar : data.hijri.weekday.en) + "، " : ""}
                            {data.hijri.day} {isArabic ? data.hijri.month.ar : data.hijri.month.en} {data.hijri.year} {data.hijri.designation}
                        </span>
                    </div>
                    <div className="zc-prayer-popout-location">
                        <span>📍 {city}, {country}</span>
                    </div>
                </div>

                {/* Timings List */}
                <div className="zc-prayer-popout-list">
                    {prayersList.map(pKey => {
                        const meta = PRAYER_NAMES[pKey];
                        const isNext = next.name === pKey;
                        const time = formatPrayerTime(data.timings[pKey], is24h, isArabic);

                        return (
                            <div key={pKey} className={`zc-prayer-item ${isNext ? "zc-prayer-item-active" : ""}`}>
                                <div className="zc-prayer-item-left">
                                    <span className="zc-prayer-item-icon">{meta.icon}</span>
                                    <span className="zc-prayer-item-name">{isArabic ? meta.ar : meta.en}</span>
                                    {isNext && (
                                        <span className="zc-prayer-item-badge">
                                            {isArabic ? "القادمة" : "Next"}
                                        </span>
                                    )}
                                </div>
                                <div className="zc-prayer-item-time">
                                    {time}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Next Prayer Countdown Bar */}
                <div className="zc-prayer-popout-footer">
                    <div className="zc-prayer-countdown-bar">
                        <span>⏳ {isArabic ? `متبقي على صلاة ${prayerDisplayName}:` : `Next is ${prayerDisplayName} in:`}</span>
                        <strong className="zc-prayer-countdown-time">{countdownText}</strong>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Popout
            position="bottom"
            align="right"
            animation={Popout.Animation.NONE}
            shouldShow={showPopout}
            onRequestClose={() => setShowPopout(false)}
            targetElementRef={buttonRef}
            renderPopout={renderPopoutContent}
        >
            {() => (
                <div
                    ref={buttonRef}
                    onClick={() => setShowPopout(v => !v)}
                    className={`zc-prayer-header-pill ${showPopout ? "zc-prayer-pill-active" : ""}`}
                    title={isArabic ? "مواقيت الصلاة والتاريخ الهجري - انقر للتفاصيل" : "Prayer Times & Hijri Calendar - Click for details"}
                >
                    <span className="zc-prayer-pill-icon">🕌</span>
                    <span className="zc-prayer-pill-title">{prayerDisplayName}</span>
                    <span className="zc-prayer-pill-time">{formattedNextTime}</span>
                    {showCountdown && (
                        <span className="zc-prayer-pill-countdown">({countdownText})</span>
                    )}
                </div>
            )}
        </Popout>
    );
}

