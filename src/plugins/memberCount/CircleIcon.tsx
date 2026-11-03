/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function CircleIcon({ className }: { className?: string; }) {
    return (
        <svg viewBox="0 0 24 24" className={className}>
            <circle
                cx="12"
                cy="12"
                r="8"
            />
        </svg>
    );
}
