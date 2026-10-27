/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { BadgePosition, BadgeUserArgs, ProfileBadge } from "@api/Badges";
import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { CopyIcon, LinkIcon } from "@components/Icons";
import { copyWithToast } from "@utils/discord";
import { ContextMenuApi, Forms, Menu, Modal, openModal } from "@webpack/common";

/**
 * الأيقونات الافتراضية للشارات الأربعة في ZenCord
 * يمكن للموقع عبر قاعدة البيانات تمرير أي رابط صورة أو GIF مخصص، أو الاكتفاء بتحديد النوع (type).
 */
export const ZEN_BADGE_ICONS = {
    // 1. شارة المتبرع (ZenCord Supporter)
    DONOR: "https://cdn.discordapp.com/emojis/1026533070955872337.png",

    // 2. شارة المبرمجين (خاصة بك وبالمبرمجين فقط)
    DEVELOPER: "https://cdn.discordapp.com/emojis/1562267648857997356.webp?size=240",

    // 3. شارة بوتات زن كورد (ZenCord Official Bot)
    BOT: "https://cdn.discordapp.com/emojis/1039992459209490513.png",

    // 4. شارة VIP (ZenCord VIP Member)
    VIP: "https://cdn.discordapp.com/emojis/1238120638020063377.png"
};

/**
 * هيكل بيانات الشارة القادمة من الـ API / قاعدة بيانات الموقع:
 * GET /api/badges ->
 * {
 *   "USER_DISCORD_ID": [
 *     {
 *       "type": "developer" | "bot" | "vip" | "donor" | "custom",
 *       "tooltip": "النص الذي يظهر عند الوقوف على الشارة بالماوس",
 *       "badge": "رابط صورة أو GIF للشارة (اختياري - إن لم يحدد سيستخدم الأيقونة الافتراضية للنوع)"
 *     }
 *   ]
 * }
 */
export interface ZenBadgeDbEntry {
    type?: "developer" | "bot" | "vip" | "donor" | "custom";
    tooltip?: string;
    badge?: string;
}

export type ZenBadgesDatabase = Record<string, ZenBadgeDbEntry[]>;

function ZenBadgeContextMenu({ badge }: { badge: Omit<ProfileBadge, "id"> & BadgeUserArgs; }) {
    return (
        <Menu.Menu
            navId="zc-badge-context"
            onClose={ContextMenuApi.closeContextMenu}
            aria-label="ZenCord Badge Options"
        >
            {badge.description && (
                <Menu.MenuItem
                    id="zc-badge-copy-name"
                    label="Copy Badge Name"
                    action={() => copyWithToast(badge.description!)}
                    leadingAccessory={{ type: "icon", icon: CopyIcon }}
                />
            )}
            {badge.iconSrc && (
                <Menu.MenuItem
                    id="zc-badge-copy-link"
                    label="Copy Badge Image Link"
                    action={() => copyWithToast(badge.iconSrc!)}
                    leadingAccessory={{ type: "icon", icon: LinkIcon }}
                />
            )}
        </Menu.Menu>
    );
}

function openBadgeModal(title: string, subtitle: string, iconSrc: string, description: string) {
    openModal(props => (
        <ErrorBoundary noop>
            <Modal
                {...props}
                title={
                    <Forms.FormTitle
                        tag="h2"
                        style={{
                            width: "100%",
                            textAlign: "center",
                            margin: 0
                        }}
                    >
                        <Flex justifyContent="center" alignItems="center" gap="0.5em">
                            {title}
                        </Flex>
                    </Forms.FormTitle>
                }
            >
                <div style={{ padding: "1.5em", textAlign: "center" }}>
                    <div style={{ marginBottom: "1em" }}>
                        <img
                            src={iconSrc}
                            alt={title}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                margin: "0 auto",
                                boxShadow: "0 0 25px rgba(99, 102, 241, 0.45)",
                                objectFit: "contain"
                            }}
                        />
                    </div>
                    <Forms.FormTitle tag="h3" style={{ margin: "0.5em 0", color: "var(--header-primary)" }}>
                        {subtitle}
                    </Forms.FormTitle>
                    <Forms.FormText style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
                        {description}
                    </Forms.FormText>
                </div>
            </Modal>
        </ErrorBoundary>
    ));
}

/**
 * تحويل سجل الشارة القادم من قاعدة بيانات الموقع إلى شارة متكاملة في ديسكورد
 */
export function createZenBadgeFromDb(entry: ZenBadgeDbEntry, index: number, userId: string): ProfileBadge {
    const type = entry.type || "donor";
    let defaultTitle = "ZenCord Supporter";
    let defaultSubtitle = "Valued Project Donor";
    let defaultIcon = ZEN_BADGE_ICONS.DONOR;
    let defaultDescription = "Thank you for supporting the development of ZenCord! Your contributions keep the project alive.";

    if (type === "developer") {
        defaultTitle = "ZenCord Developer";
        defaultSubtitle = "Official Developer & Contributor";
        defaultIcon = ZEN_BADGE_ICONS.DEVELOPER;
        defaultDescription = "This user is a verified developer of the ZenCord project, building and maintaining custom features.";
    } else if (type === "bot") {
        defaultTitle = "ZenCord Official Bot";
        defaultSubtitle = "Verified ZenCord Automation";
        defaultIcon = ZEN_BADGE_ICONS.BOT;
        defaultDescription = "This application is an officially verified bot integrated with the ZenCord ecosystem.";
    } else if (type === "vip") {
        defaultTitle = "ZenCord VIP";
        defaultSubtitle = "Exclusive VIP Member";
        defaultIcon = ZEN_BADGE_ICONS.VIP;
        defaultDescription = "This user is an exclusive VIP member of ZenCord with access to elite privileges and early features.";
    }

    const iconSrc = entry.badge || defaultIcon;
    const tooltip = entry.tooltip || defaultTitle;

    return {
        id: `zencord_db_badge_${userId}_${index}`,
        description: tooltip,
        iconSrc,
        position: BadgePosition.START,
        props: {
            style: {
                borderRadius: "50%",
                transform: "scale(0.9)"
            }
        },
        onContextMenu: (event, badge) => {
            ContextMenuApi.openContextMenu(event, () => <ZenBadgeContextMenu badge={badge} />);
        },
        onClick: () => openBadgeModal(defaultTitle, defaultSubtitle, iconSrc, defaultDescription)
    };
}
