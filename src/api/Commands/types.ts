/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Command } from "@zencord/discord-types";
export { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "@zencord/discord-types/enums";

export interface ZenCordCommand extends Command {
    isZenCordCommand?: boolean;
    isVencordCommand?: boolean;
    rootCommand?: ZenCordCommand;
}
export type VencordCommand = ZenCordCommand;
