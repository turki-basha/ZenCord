/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { OpenExternalIcon, SearchIcon } from "@components/Icons";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";

const Engines = {
    Google: "https://lens.google.com/uploadbyurl?url=",
    Yandex: "https://yandex.com/images/search?rpt=imageview&url=",
    SauceNAO: "https://saucenao.com/search.php?url=",
    IQDB: "https://iqdb.org/?url=",
    Bing: "https://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:",
    TinEye: "https://www.tineye.com/search?url=",
    ImgOps: "https://imgops.com/start?url="
} as const;

function search(src: string, engine: string) {
    open(engine + encodeURIComponent(src), "_blank");
}

function makeSearchItem(src: string) {
    return (
        <Menu.MenuItem
            label="Search Image"
            key="search-image"
            id="search-image"
            leadingAccessory={{ type: "icon", icon: SearchIcon }}
        >
            {Object.keys(Engines).map((engine, i) => {
                const key = "search-image-" + engine;
                return (
                    <Menu.MenuItem
                        key={key}
                        id={key}
                        label={engine}
                        leadingAccessory={{ type: "image", src: `https://icons.duckduckgo.com/ip3/${new URL(Engines[engine]).host}.ico` }}
                        action={() => search(src, Engines[engine])}
                    />
                );
            })}
            <Menu.MenuItem
                key="search-image-all"
                id="search-image-all"
                label="All"
                leadingAccessory={{ type: "icon", icon: OpenExternalIcon }}
                action={() => Object.values(Engines).forEach(e => search(src, e))}
            />
        </Menu.MenuItem>
    );
}

const messageContextMenuPatch: NavContextMenuPatchCallback = (children, props) => {
    if (props?.reverseImageSearchType !== "img") return;

    const src = props.itemHref ?? props.itemSrc;

    const group = findGroupChildrenByChildId("copy-link", children);
    group?.push(makeSearchItem(src));
};

const imageContextMenuPatch: NavContextMenuPatchCallback = (children, props) => {
    if (!props?.src) return;

    const group = findGroupChildrenByChildId("copy-native-link", children) ?? children;
    group.push(makeSearchItem(props.src));
};

export default definePlugin({
    name: "ReverseImageSearch",
    description: "Adds ImageSearch to image context menus",
    tags: ["Media", "Utility"],
    authors: [Devs.Ven, Devs.Nuckyz],
    searchTerms: ["ImageUtilities"],

    patches: [
        {
            find: "#{intl::MESSAGE_ACTIONS_MENU_LABEL}),shouldHideMediaOptions:",
            replacement: {
                match: /favoriteableType:\i,(?<=(\i)\.getAttribute\("data-type"\).+?)/,
                replace: (m, target) => `${m}reverseImageSearchType:${target}.getAttribute("data-role"),`
            }
        }
    ],
    contextMenus: {
        "message": messageContextMenuPatch,
        "image-context": imageContextMenuPatch
    }
});
