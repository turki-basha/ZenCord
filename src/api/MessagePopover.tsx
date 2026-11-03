/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Logger } from "@utils/Logger";
import { IconComponent, IconProps } from "@utils/types";
import { Message } from "@zencord/discord-types";
import type { ComponentType, HTMLProps, ReactElement } from "react";

import { useSettings } from "./Settings";

const logger = new Logger("MessagePopover");

export interface MessagePopoverButtonItem extends HTMLProps<HTMLDivElement> {
    key?: string,
    label: string,
    icon: ComponentType<any>,
    ariaLabel?: string,
    buttonClassName?: string
    dangerous?: boolean,
    disabled?: boolean,
    iconProps?: IconProps,
    onTooltipShow?: () => void,
    onTooltipHide?: () => void,
    separator?: boolean,
    tooltipText?: ReactElement,
}

export type MessagePopoverButtonFactory = (message: Message) => MessagePopoverButtonItem | null;
export type MessagePopoverButtonData = {
    render: MessagePopoverButtonFactory;
    /**
     * This icon is used only for Settings UI. Your render function must still return an icon,
     * and it can be different from this one.
     */
    icon: IconComponent;
};

export const MessagePopoverButtonMap = new Map<string, MessagePopoverButtonData>();

/**
 * The icon argument is used only for Settings UI. Your render function must still return an icon,
 * and it can be different from this one.
 */
export function addMessagePopoverButton(
    identifier: string,
    render: MessagePopoverButtonFactory,
    icon: IconComponent
) {
    MessagePopoverButtonMap.set(identifier, { render, icon });
}

export function removeMessagePopoverButton(identifier: string) {
    MessagePopoverButtonMap.delete(identifier);
}

function VencordPopoverButtons(props: { Component: React.ComponentType<MessagePopoverButtonItem>, message: Message; }) {
    const { Component, message } = props;

    const { messagePopoverButtons } = useSettings(["uiElements.messagePopoverButtons.*"]).uiElements;

    const elements = Array.from(MessagePopoverButtonMap.entries())
        .filter(([key]) => messagePopoverButtons[key]?.enabled !== false)
        .map(([key, { render }]) => {
            try {
                // FIXME: this should use proper React to ensure hooks work
                const item = render(message);
                if (!item) return null;

                return (
                    <ErrorBoundary noop>
                        <Component key={key} {...item} />
                    </ErrorBoundary>
                );
            } catch (err) {
                logger.error(`[${key}]`, err);
                return null;
            }
        });

    return <>{elements}</>;
}

export function _buildPopoverElements(
    Component: React.ComponentType<MessagePopoverButtonItem>,
    message: Message
) {
    return <VencordPopoverButtons Component={Component} message={message} />;
}
