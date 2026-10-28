/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./styles.css";

import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { Popout, useRef, useState } from "@webpack/common";
import type { PropsWithChildren } from "react";

import { renderPopout } from "./menu";

const HeaderBarIcon = findComponentByCodeLazy(".HEADER_BAR_BADGE_BOTTOM,", 'position:"bottom"');

export const settings = definePluginSettings({
    showPluginMenu: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show the plugins menu in the toolbox",
    }
});

function Icon({ isShown }: { isShown: boolean; }) {
    return (
        <svg viewBox="0 0 24 24" width={20} height={20} className="vc-toolbox-icon">
            <path
                fill="currentColor"
                d="M12 2C11.5 5 9.5 7.5 7 9c2.5 1.5 4.5 4 5 7 0.5-3 2.5-5.5 5-7-2.5-1.5-4.5-4-5-7zm-1 9c-2.5-.5-5-2.5-6-5 0.5 3 2.5 5.5 5 6.5.5-.5 1-1 1-1.5zm2 0c0 .5.5 1 1 1.5 2.5-1 4.5-3.5 5-6.5-1 2.5-3.5 4.5-6 5zm-1 2c-.5.5-1 1-1 1.5 2.5.5 5 2.5 6 5-.5-3-2.5-5.5-5-6.5zm2 0c-2.5 1-4.5 3.5-5 6.5 1-2.5 3.5-4.5 6-5 0-.5-.5-1-1-1.5z"
            />
        </svg>
    );
}

function VencordPopoutButton() {
    const buttonRef = useRef(null);
    const [show, setShow] = useState(false);

    return (
        <Popout
            position="bottom"
            align="right"
            animation={Popout.Animation.NONE}
            shouldShow={show}
            onRequestClose={() => setShow(false)}
            targetElementRef={buttonRef}
            renderPopout={() => renderPopout(() => setShow(false))}
        >
            {(_, { isShown }) => (
                <HeaderBarIcon
                    ref={buttonRef}
                    className="vc-toolbox-btn"
                    onClick={() => setShow(v => !v)}
                    tooltip={isShown ? null : "ZenCord Quick Access"}
                    icon={() => <Icon isShown={isShown} />}
                    selected={isShown}
                />
            )}
        </Popout>
    );
}

export default definePlugin({
    name: "VencordToolbox",
    description: "Adds an elegant Quick Access button to the header for ZenCord settings and actions",
    tags: ["Utility", "Developers"],
    authors: [Devs.Ven, Devs.AutumnVN],
    enabledByDefault: true,

    settings,

    patches: [
        {
            find: '?"BACK_FORWARD_NAVIGATION":',
            replacement: {
                match: /(trailing:.{0,50}?)\i\.Fragment,(?=\{children:\[)/,
                replace: "$1$self.TrailingWrapper,"
            }
        }
    ],

    TrailingWrapper({ children }: PropsWithChildren) {
        return (
            <>
                {children}
                <ErrorBoundary key="vc-toolbox" noop>
                    <VencordPopoutButton />
                </ErrorBoundary>
            </>
        );
    },
});
