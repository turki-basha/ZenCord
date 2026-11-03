/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Tooltip } from "@webpack/common";
import { TooltipProps } from "@zencord/discord-types";

export function TooltipContainer({ children, ...props }: Omit<TooltipProps, "children"> & { children: React.ReactNode; }) {
    return (
        <Tooltip {...props}>
            {tooltipProps =>
                <div {...tooltipProps}>
                    {children}
                </div>
            }
        </Tooltip>
    );
}
