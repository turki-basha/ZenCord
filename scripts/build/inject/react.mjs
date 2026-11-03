/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const VencordFragment = /* #__PURE__*/ Symbol.for("react.fragment");
export let VencordCreateElement =
    (...args) => (VencordCreateElement = Vencord.Webpack.Common.React.createElement)(...args);
