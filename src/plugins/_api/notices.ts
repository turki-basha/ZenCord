/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { _renderNotice, VENCORD_NOTICE_TYPE } from "@api/Notices";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoticesAPI",
    description: "Fixes notices being automatically dismissed",
    authors: [Devs.Ven],
    required: true,
    patches: [
        {
            find: '"NoticeStore"',
            replacement: [
                {
                    match: /(?<=!1;)\i=null;(?=.{0,80}getPremiumSubscription\(\))/g,
                    replace: "if(Vencord.Api.Notices.currentNotice)return false;$&"
                },
                {
                    match: /(?<=,NOTICE_DISMISS:function\(\i\){)return null!=(\i)/,
                    replace: (m, notice) => `if(${notice}?.type=="${VENCORD_NOTICE_TYPE}")return(${notice}=null,Vencord.Api.Notices.nextNotice(),true);${m}`
                }
            ]
        },
        {
            find: ".GLOBAL_BANNER_PREVIEW:return",
            replacement: {
                match: /switch\((\i)\.type\){(?=case \i\.\i\.GLOBAL_BANNER_PREVIEW:)/,
                replace: `$&case "${VENCORD_NOTICE_TYPE}":return $self.renderNotice($1);`
            }
        }
    ],

    renderNotice: ErrorBoundary.wrap(_renderNotice, { noop: true })
});
