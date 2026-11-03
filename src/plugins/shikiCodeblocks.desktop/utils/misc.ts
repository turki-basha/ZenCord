/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { resolveLang } from "@plugins/shikiCodeblocks.desktop/api/languages";
import { HighlighterProps } from "@plugins/shikiCodeblocks.desktop/components/Highlighter";
import { HighlighterSetting } from "@plugins/shikiCodeblocks.desktop/types";
import { classNameFactory } from "@utils/css";
import { filters, mapMangledModuleLazy } from "@webpack";

export const cl = classNameFactory("vc-shiki-");

export const arboriumLanguages = mapMangledModuleLazy('jldoctest:"julia"', {
    resolveLang: filters.byCode(/!\i.test\(/, ".toLowerCase();")
});
export const arboriumGrammars = mapMangledModuleLazy(".createSession();try{", {
    getGrammar: filters.byCode(/return null==\i&&/, /\i\.set\(\i/)
});

export const shouldUseArborium = ({
    lang,
    tryDiscordHighlighter,
}: {
    lang: HighlighterProps["lang"],
    tryDiscordHighlighter: HighlighterSetting,
}) => {
    const arboriumLang = lang ? arboriumLanguages.resolveLang(lang) : null;
    const shikiLang = lang ? resolveLang(lang) : null;
    const langName = shikiLang?.name;

    switch (tryDiscordHighlighter) {
        case HighlighterSetting.Always:
            return true;
        case HighlighterSetting.Primary:
            return !!arboriumLang || lang === "";
        case HighlighterSetting.Secondary:
            return !langName && !!arboriumLang;
        case HighlighterSetting.Never:
            return false;
        default: return false;
    }
};
