/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Parser, useEffect, useState } from "@webpack/common";
import { Message } from "@zencord/discord-types";

import { TranslateIcon } from "./TranslateIcon";
import { cl, TranslationValue } from "./utils";

interface TranslationSetter {
    messageId: string;
    handleTranslation(v: TranslationValue): void;
}

const TranslationSetters = new Set<TranslationSetter>();

export function handleTranslate(messageId: string, data: TranslationValue) {
    for (const setter of TranslationSetters) {
        if (setter.messageId === messageId) {
            setter.handleTranslation(data);
        }
    }
}

function Dismiss({ onDismiss }: { onDismiss: () => void; }) {
    return (
        <button
            onClick={onDismiss}
            className={cl("dismiss")}
        >
            Dismiss
        </button>
    );
}

export function TranslationAccessory({ message }: { message: Message; }) {
    const [translation, setTranslation] = useState<TranslationValue>();

    useEffect(() => {
        // Ignore MessageLinkEmbeds messages
        if ((message as any).vencordEmbeddedBy) return;

        const setter: TranslationSetter = {
            messageId: message.id,
            handleTranslation: setTranslation
        };

        TranslationSetters.add(setter);
        return () => void TranslationSetters.delete(setter);
    }, []);

    if (!translation) return null;

    return (
        <span className={cl("accessory")}>
            <TranslateIcon width={16} height={16} className={cl("accessory-icon")} />
            {Parser.parse(translation.text)}
            <br />
            (translated from {translation.sourceLanguage} - <Dismiss onDismiss={() => setTranslation(undefined)} />)
        </span>
    );
}
