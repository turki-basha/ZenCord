/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { resolveLang } from "@plugins/shikiCodeblocks.desktop/api/languages";
import { shiki } from "@plugins/shikiCodeblocks.desktop/api/shiki";
import { useShikiSettings } from "@plugins/shikiCodeblocks.desktop/hooks/useShikiSettings";
import { useTheme } from "@plugins/shikiCodeblocks.desktop/hooks/useTheme";
import { hex2Rgb } from "@plugins/shikiCodeblocks.desktop/utils/color";
import { arboriumGrammars, arboriumLanguages, cl, shouldUseArborium } from "@plugins/shikiCodeblocks.desktop/utils/misc";
import { useAwaiter, useIntersection } from "@utils/react";
import { React } from "@webpack/common";

import { ButtonRow } from "./ButtonRow";
import { Code } from "./Code";
import { Header } from "./Header";

export interface ThemeBase {
    plainColor: string;
    accentBgColor: string;
    accentFgColor: string;
    backgroundColor: string;
}

export interface HighlighterProps {
    lang?: string;
    content: string;
    isPreview: boolean;
}

export const HighlighterContainer = (props: HighlighterProps) => {
    return (
        <pre className={cl("container")}>
            <ErrorBoundary>
                <Highlighter {...props} />
            </ErrorBoundary>
        </pre>
    );
};

export const Highlighter = ({
    lang,
    content,
    isPreview,
}: HighlighterProps) => {
    const {
        tryDiscordHighlighter,
        useDevIcon,
        bgOpacity,
    } = useShikiSettings(["tryDiscordHighlighter", "useDevIcon", "bgOpacity"]);
    const { id: currentThemeId, theme: currentTheme } = useTheme();

    const shikiLang = lang ? resolveLang(lang) : null;
    const arboriumLang = lang ? arboriumLanguages.resolveLang(lang) : null;
    const useArborium = shouldUseArborium({ lang, tryDiscordHighlighter });

    const [rootRef, isIntersecting] = useIntersection(true);

    const [tokens] = useAwaiter(async () => {
        if (!shikiLang || useArborium || !isIntersecting) return null;
        return await shiki.tokenizeCode(content, lang!);
    }, {
        fallbackValue: null,
        deps: [lang, content, currentThemeId, isIntersecting],
    });

    const [arboriumHtml] = useAwaiter(async () => {
        if (!useArborium || !isIntersecting) return null;
        const grammar = await arboriumGrammars.getGrammar(arboriumLang);
        return grammar?.highlightToHtml(content).html;
    }, {
        fallbackValue: null,
        deps: [arboriumLang, content, useArborium, isIntersecting],
    });

    const themeBase: ThemeBase = {
        plainColor: currentTheme?.fg || "var(--text-default)",
        accentBgColor:
            currentTheme?.colors?.["statusBar.background"] || (useArborium ? "#7289da" : "#007BC8"),
        accentFgColor: currentTheme?.colors?.["statusBar.foreground"] || "#FFF",
        backgroundColor:
            currentTheme?.colors?.["editor.background"] || "var(--background-base-lower)",
    };

    let langName;
    if (lang) langName = useArborium ? arboriumLang : shikiLang?.name;

    return (
        <div
            ref={rootRef}
            className={cl("root", { plain: !langName, preview: isPreview })}
            style={{
                backgroundColor: useArborium
                    ? themeBase.backgroundColor
                    : `rgba(${hex2Rgb(themeBase.backgroundColor)
                        .concat(bgOpacity / 100)
                        .join(", ")})`,
                color: themeBase.plainColor,
            }}
        >
            <code className={cl("code")}>
                <Header
                    langName={langName}
                    useDevIcon={useDevIcon}
                    shikiLang={shikiLang}
                />
                <Code
                    theme={themeBase}
                    useArborium={useArborium}
                    arboriumHtml={arboriumHtml}
                    content={content}
                    tokens={tokens}
                />
                {!isPreview && <ButtonRow
                    content={content}
                    theme={themeBase}
                />}
            </code>
        </div>
    );
};

