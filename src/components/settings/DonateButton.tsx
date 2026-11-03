/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button } from "@webpack/common";
import { ButtonProps } from "@zencord/discord-types";

export default function DonateButton({
    look = Button.Looks.LINK,
    color = Button.Colors.TRANSPARENT,
    ...props
}: Partial<ButtonProps>) {
    return null;
}
