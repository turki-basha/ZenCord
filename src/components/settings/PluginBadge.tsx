/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function AddonBadge({ text, color }: { text: string; color?: string; }) {
    return (
        <div className="vc-addon-badge" style={{
            backgroundColor: color ?? "var(--status-positive, #23a55a)",
            justifySelf: "flex-end",
            marginLeft: "auto",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "6px",
            boxShadow: "0 0 10px rgba(35, 165, 90, 0.45)",
            display: "inline-block",
            whiteSpace: "nowrap",
            lineHeight: "14px"
        }}>
            {text}
        </div>
    );
}
