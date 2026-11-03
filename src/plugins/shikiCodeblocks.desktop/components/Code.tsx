/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { cl } from "@plugins/shikiCodeblocks.desktop/utils/misc";
import type { IThemedToken } from "@vap/shiki";
import { JSX } from "react";

import { ThemeBase } from "./Highlighter";

export interface CodeProps {
    theme: ThemeBase;
    useArborium: boolean;
    arboriumHtml: string | null;
    content: string;
    tokens: IThemedToken[][] | null;
}

export const Code = ({
    theme,
    useArborium,
    arboriumHtml,
    content,
    tokens,
}: CodeProps) => {
    let lines!: JSX.Element[];

    if (useArborium && arboriumHtml) {
        lines = arboriumHtml
            .split("\n")
            .map((line, i) => <span key={i} dangerouslySetInnerHTML={{ __html: line }} />);
    } else {
        const renderTokens =
            tokens ??
            content
                .split("\n")
                .map(line => [{ color: theme.plainColor, content: line } as IThemedToken]);

        lines = renderTokens.map((line, idx) => {
            // [Cynthia] this makes it so when you highlight the codeblock
            // empty lines are also selected and copied when you Ctrl+C.
            if (line.length === 0) {
                return <span key={idx}>{"\n"}</span>;
            }

            return (
                <>
                    {line.map(({ content, color, fontStyle }, i) => (
                        <span
                            key={i}
                            style={{
                                color,
                                fontStyle: (fontStyle ?? 0) & 1 ? "italic" : undefined,
                                fontWeight: (fontStyle ?? 0) & 2 ? "bold" : undefined,
                                textDecoration: (fontStyle ?? 0) & 4 ? "underline" : undefined,
                            }}
                        >
                            {content}
                        </span>
                    ))}
                </>
            );
        });
    }

    const codeTableRows = lines.map((line, i) => (
        <tr className={cl("table-row")} key={i}>
            <td className={cl("table-cell")} style={{ color: theme.plainColor }}>{i + 1}</td>
            <td className={cl("table-cell")}>{line}</td>
        </tr>
    ));

    return <table className={cl("table")}>{...codeTableRows}</table>;
};
