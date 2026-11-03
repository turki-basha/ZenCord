/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings, useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Heading } from "@components/Heading";
import { Margins } from "@components/margins";
import { Paragraph } from "@components/Paragraph";
import { getTranslationForText } from "@plugins/arabicUI/translations";
import { IS_WINDOWS } from "@utils/constants";
import { Select } from "@webpack/common";

function t(text?: string): string | undefined {
    if (!text) return text;
    if (Settings.plugins?.ArabicUI?.enabled && Settings.plugins?.ArabicUI?.translateZenCordUI !== false) {
        return getTranslationForText(text) || text;
    }
    return text;
}

export function WindowsMaterialSettings() {
    const settings = useSettings(["windowsMaterial"]);

    if (!IS_WINDOWS || IS_WEB || !VencordNative.native.supportsWindowsMaterial()) return null;

    return (
        <ErrorBoundary noop>
            <Heading tag="h5">{t("Background Material")}</Heading>
            <Paragraph className={Margins.bottom8}>
                {t("Windows transparent background effects. You need a theme that supports transparency or this will do nothing. A restart is required after changing this setting.")}
            </Paragraph>

            <Select
                placeholder={t("None") || "None"}
                options={[
                    {
                        label: t("None") || "None",
                        value: "none",
                        default: true
                    },
                    {
                        label: "Mica (incorporates system theme + desktop wallpaper to paint the background)",
                        value: "mica"
                    },
                    {
                        label: "Tabbed (variant of Mica with stronger background tinting)",
                        value: "tabbed"
                    },
                    {
                        label: "Acrylic (blurs the window behind Vesktop for a translucent background)",
                        value: "acrylic"
                    }
                ]}
                closeOnSelect={true}
                select={v => (settings.windowsMaterial = v)}
                isSelected={v => v === settings.windowsMaterial}
                serialize={s => s}
            />
        </ErrorBoundary>
    );
}
