/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { filters, mapMangledModuleLazy, waitFor } from "@webpack";
import type * as t from "@zencord/discord-types";

export const Menu = {} as t.Menu;

waitFor(filters.componentByCode('path:["empty"]'), m => Menu.Menu = m);
waitFor(filters.componentByCode(".SLIDER", "renderValue"), m => Menu.MenuSliderControl = m);
waitFor(filters.componentByCode(".SEARCH)", ".focus()", "query:"), m => Menu.MenuSearchControl = m);

export const ContextMenuApi: t.ContextMenuApi = mapMangledModuleLazy('type:"CONTEXT_MENU_OPEN', {
    closeContextMenu: filters.byCode("CONTEXT_MENU_CLOSE"),
    openContextMenu: filters.byCode("renderLazy:"),
    openContextMenuLazy: e => typeof e === "function" && e.toString().length < 100
});
