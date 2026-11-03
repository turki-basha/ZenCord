/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { isPluginEnabled } from "@api/PluginManager";
import { LinkIcon, TopRightArrow } from "@components/Icons";
import ExpressionClonerPlugin from "@plugins/expressionCloner";
import { Devs } from "@utils/constants";
import { copyWithToast } from "@utils/discord";
import definePlugin from "@utils/types";
import { Menu, React, StickersStore } from "@webpack/common";
import { Message, Sticker } from "@zencord/discord-types";

const StickerExt = [, "png", "png", "json", "gif"] as const;

type PartialSticker = Pick<Sticker, "id" | "format_type">;

function getUrl(data: PartialSticker): string {
    if (data.format_type === 4)
        return `https:${window.GLOBAL_ENV.MEDIA_PROXY_ENDPOINT}/stickers/${data.id}.gif?size=512&lossless=true`;

    return `https://${window.GLOBAL_ENV.CDN_HOST}/stickers/${data.id}.${StickerExt[data.format_type]}?size=512&lossless=true`;
}

function buildMenuItem(sticker: PartialSticker, addBottomSeparator: boolean) {
    return (
        <>
            <Menu.MenuGroup>
                <Menu.MenuItem
                    id="vc-copy-sticker-link"
                    key="vc-copy-sticker-link"
                    label="Copy Sticker Link"
                    leadingAccessory={{ type: "icon", icon: LinkIcon }}
                    action={() => copyWithToast(getUrl(sticker), "Link copied!")}
                />

                <Menu.MenuItem
                    id="vc-open-sticker-link"
                    key="vc-open-sticker-link"
                    label="Open Sticker Link"
                    leadingAccessory={{ type: "icon", icon: LinkIcon }}
                    trailingIndicator={{ type: "icon", icon: TopRightArrow }}
                    action={() => VencordNative.native.openExternal(getUrl(sticker))}
                />
            </Menu.MenuGroup>
            {addBottomSeparator && <Menu.MenuSeparator />}
        </>
    );
}

const messageContextMenuPatch: NavContextMenuPatchCallback = (
    children,
    { favoriteableId, favoriteableType, message }: { favoriteableId: string; favoriteableType: string; message: Message; }
) => {
    if (!favoriteableId || favoriteableType !== "sticker") return;

    const sticker = message.stickerItems.find(s => s.id === favoriteableId);
    if (!sticker?.format_type) return;

    children.splice(-1, 0, buildMenuItem(sticker, false));
};

const expressionPickerPatch: NavContextMenuPatchCallback = (children, props: { target: HTMLElement; }) => {
    const id = props?.target?.dataset?.id;
    if (!id) return;
    if (props.target.className?.includes("lottieCanvas")) return;

    const sticker = StickersStore.getStickerById(id);
    if (sticker) {
        children.push(buildMenuItem(sticker, isPluginEnabled(ExpressionClonerPlugin.name)));
    }
};

export default definePlugin({
    name: "CopyStickerLinks",
    description: "Adds the ability to copy & open Sticker links",
    tags: ["Emotes", "Utility"],
    authors: [Devs.Ven, Devs.Byeoon],
    contextMenus: {
        "message": messageContextMenuPatch,
        "expression-picker": expressionPickerPatch
    }
});
