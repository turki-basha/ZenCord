/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import gitHash from "~git-hash";
import gitRemote from "~git-remote";

export { gitHash, gitRemote };

export const ZENCORD_USER_AGENT = `ZenCord/${gitHash}${gitRemote ? ` (https://github.com/${gitRemote})` : ""}`;
export const VENCORD_USER_AGENT = ZENCORD_USER_AGENT;
