/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findLazy } from "@webpack";

export const UserSettingsActionCreators = {
    FrecencyUserSettingsActionCreators: findLazy(m => m.ProtoClass?.typeName?.endsWith(".FrecencyUserSettings")),
    PreloadedUserSettingsActionCreators: findLazy(m => m.ProtoClass?.typeName?.endsWith(".PreloadedUserSettings")),
};
