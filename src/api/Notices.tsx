/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { isObject } from "@utils/misc";
import { isPrimitiveReactNode } from "@utils/react";
import { filters, mapMangledModuleLazy } from "@webpack";
import { FluxDispatcher } from "@webpack/common";
import type { Notice, NoticeColors as TNoticeColors, NoticeOptions } from "@zencord/discord-types";
import { MouseEvent, ReactNode } from "react";

const { Notice, NoticeButton, NoticeCloseButton, _NoticeColors } = mapMangledModuleLazy(["APP_NOTICE_PRIMARY_CTA_OPENED", "DEFAULT:"], {
    Notice: filters.byCode(".DEFAULT,", '"div"'),
    NoticeCloseButton: filters.byCode("APP_NOTICE_CLOSED"),
    NoticeButton: filters.byCode('"button"'),
    _NoticeColors: filters.byProps("DEFAULT", "DANGER")
});

export const NoticeColors: TNoticeColors = _NoticeColors;

export const VENCORD_NOTICE_TYPE = "VencordNotice";
export const noticesQueue: Notice[] = [];
export let currentNotice: Notice | undefined = undefined;

export function dismissNotice(notice?: Pick<Notice, "id" | "type">) {
    return FluxDispatcher.dispatch({ type: "NOTICE_DISMISS", ...notice });
}

export async function popNotice() {
    const notice = currentNotice;
    if (notice) {
        currentNotice = undefined;
        await dismissNotice(notice);
    }

    nextNotice();
}

export function nextNotice() {
    currentNotice = noticesQueue.shift();

    if (currentNotice) {
        FluxDispatcher.dispatch({ type: "NOTICE_SHOW", notice: currentNotice });
    }
}

function buildLegacyNotice(message: ReactNode, buttonText: string, onOkClick: () => void): NoticeOptions {
    return {
        message,
        buttonText,
        callback: onOkClick
    };
}

export function showNotice(notice: NoticeOptions): void;
/** @deprecated use showNotice({ message, buttonText, callback }) */
export function showNotice(message: ReactNode, buttonText: string, onOkClick: () => void): void;
export function showNotice(messageOrNotice: ReactNode | NoticeOptions, buttonText?: string, onOkClick?: () => void) {
    const notice = isObject(messageOrNotice) && "message" in messageOrNotice
        ? messageOrNotice
        : buildLegacyNotice(messageOrNotice, buttonText!, onOkClick!);

    if (!isPrimitiveReactNode(notice.message))
        messageOrNotice = <ErrorBoundary fallback={() => "Error Showing Notice"}>{notice.message}</ErrorBoundary>;

    const fullNotice: Notice = {
        id: crypto.randomUUID(),
        buttonText: notice.buttonText || "Dismiss",
        ...notice,
        callback(event: MouseEvent<HTMLButtonElement>) {
            const dismiss = async () => {
                if (currentNotice === fullNotice) {
                    currentNotice = undefined;
                    await dismissNotice(fullNotice);
                    nextNotice();
                }
            };

            if (notice.callback) {
                notice.callback({ event, dismiss });
            } else {
                dismiss();
            }
        },
        type: VENCORD_NOTICE_TYPE
    };

    noticesQueue.push(fullNotice);

    if (!currentNotice) nextNotice();
}

/** Don't use this. */
export function _renderNotice({ message, callback, buttonText, color, id }: Notice) {
    return (
        <Notice color={color} key={id}>
            <NoticeCloseButton onClick={popNotice} />
            {message}
            <NoticeButton onClick={callback}>{buttonText}</NoticeButton>
        </Notice>
    );
}
