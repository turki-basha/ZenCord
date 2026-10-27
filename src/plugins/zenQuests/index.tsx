/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import { findByCodeLazy, findByPropsLazy } from "@webpack";
import { RestAPI, showToast } from "@webpack/common";

const logger = new Logger("ZenQuests", "#5865F2");

const QuestsStore = findByPropsLazy("getQuest", "quests") as any;
const RunningGameStore = findByPropsLazy("getRunningGames", "getGameForPID") as any;

const QuestEnrollAction = findByCodeLazy('type:"QUESTS_ENROLL_BEGIN"') as any;
const QuestClaimAction = findByCodeLazy('type:"QUESTS_CLAIM_REWARD_BEGIN"') as any;
const ReportVideoProgress = findByCodeLazy(".QUESTS_VIDEO_PROGRESS(") as any;

interface FakeGame {
    id: string;
    name: string;
    executables: Array<{ name: string; os: string; }>;
    cmdLine: string;
    pid: number;
    start: number;
    isLauncher: boolean;
}

const fakeGamesMap = new Map<string, FakeGame>();
let checkInterval: any = null;

const settings = definePluginSettings({
    autoEnroll: {
        type: OptionType.BOOLEAN,
        description: "Automatically accept and enroll in all newly available Discord quests",
        default: true
    },
    autoCompleteVideo: {
        type: OptionType.BOOLEAN,
        description: "Instantly fast-forward and complete Video & Stream watching quests",
        default: true
    },
    spoofRunningGame: {
        type: OptionType.BOOLEAN,
        description: "Simulate game execution in background to passively complete playtime quests without downloading games",
        default: true
    },
    autoClaim: {
        type: OptionType.BOOLEAN,
        description: "Automatically claim reward rewards (Orbs, Nitro, badges) when a quest finishes",
        default: true
    },
    cleanQuestPromos: {
        type: OptionType.BOOLEAN,
        description: "Hide intrusive quest banners, relocation popups, and member promotions across Discord",
        default: true,
        onChange: (v: boolean) => {
            if (v) {
                document.body.classList.add("vc-zenquests-clean-ui");
            } else {
                document.body.classList.remove("vc-zenquests-clean-ui");
            }
        }
    },
    showNotifications: {
        type: OptionType.BOOLEAN,
        description: "Show a toast notification when a quest is completed or reward claimed",
        default: true
    }
});

async function enrollQuest(quest: any) {
    try {
        if (QuestEnrollAction) {
            await QuestEnrollAction(quest.id, {
                questContent: 1,
                questContentCTA: "ACCEPT_QUEST",
                sourceQuestContent: 1
            });
        } else {
            await RestAPI.post({
                url: `/quests/${quest.id}/enroll`,
                body: { location: 1 }
            });
        }
        logger.info(`Enrolled in quest: ${quest.config?.messages?.questName ?? quest.id}`);
    } catch (err) {
        logger.warn(`Failed to enroll in quest ${quest.id}:`, err);
    }
}

async function claimQuestReward(quest: any) {
    const questName = quest.config?.messages?.questName ?? "Discord Quest";
    try {
        if (QuestClaimAction) {
            await QuestClaimAction(quest.id, { platform: 0 });
        } else {
            await RestAPI.post({
                url: `/quests/${quest.id}/claim`,
                body: { platform: 0 }
            });
        }
        logger.info(`Claimed reward for quest: ${questName}`);
        if (settings.store.showNotifications) {
            showToast({ text: `🎉 ZenQuests: Claimed reward for ${questName}!`, variant: "success" });
        }
    } catch (err) {
        logger.warn(`Failed to claim reward for ${questName}:`, err);
    }
}

async function completeVideoQuest(quest: any) {
    try {
        const tasks = quest.config?.taskConfigV2?.tasks ?? quest.config?.taskConfig?.tasks ?? {};
        const videoTask = tasks.WATCH_VIDEO ?? Object.values(tasks)[0];
        const targetSeconds = (videoTask as any)?.target ?? 30;

        if (ReportVideoProgress) {
            await ReportVideoProgress(quest.id, targetSeconds);
        } else {
            await RestAPI.post({
                url: `/quests/${quest.id}/video-progress`,
                body: { timestamp: targetSeconds }
            });
        }
        logger.info(`Completed video progress for quest: ${quest.config?.messages?.questName ?? quest.id}`);
    } catch (err) {
        logger.warn(`Failed to complete video quest ${quest.id}:`, err);
    }
}

function updateFakeGames(activePlayQuests: any[]) {
    fakeGamesMap.clear();

    if (!settings.store.spoofRunningGame || activePlayQuests.length === 0) {
        return;
    }

    activePlayQuests.forEach((quest, index) => {
        const app = quest.config?.application;
        if (!app?.id || !app?.name) return;

        fakeGamesMap.set(quest.id, {
            id: app.id,
            name: app.name,
            executables: app.executables ?? [],
            cmdLine: "",
            pid: 14000 + index,
            start: Date.now() - 1000 * 60 * 5,
            isLauncher: false
        });
    });
}

export async function processQuests() {
    if (!QuestsStore) return;

    try {
        const rawQuests = QuestsStore.quests;
        if (!rawQuests) return;

        const questsList: any[] = rawQuests instanceof Map
            ? Array.from(rawQuests.values())
            : typeof rawQuests === "object"
                ? Object.values(rawQuests)
                : [];

        const activePlayQuests: any[] = [];

        for (const quest of questsList) {
            const status = quest.userStatus;
            const isEnrolled = !!status?.enrolledAt;
            const isCompleted = !!status?.completedAt;
            const isClaimed = !!status?.claimedAt;

            // 1. Auto-Claim completed rewards
            if (isCompleted && !isClaimed && settings.store.autoClaim) {
                await claimQuestReward(quest);
                continue;
            }

            // 2. Auto-Enroll newly available quests
            if (!isEnrolled && settings.store.autoEnroll) {
                await enrollQuest(quest);
                continue;
            }

            // 3. Process enrolled, uncompleted quests
            if (isEnrolled && !isCompleted) {
                const tasks = quest.config?.taskConfigV2?.tasks ?? quest.config?.taskConfig?.tasks ?? {};
                const isVideo = "WATCH_VIDEO" in tasks || Object.keys(tasks).some(t => t.toLowerCase().includes("video"));

                if (isVideo && settings.store.autoCompleteVideo) {
                    await completeVideoQuest(quest);
                } else if (settings.store.spoofRunningGame) {
                    activePlayQuests.push(quest);
                }
            }
        }

        updateFakeGames(activePlayQuests);
    } catch (err) {
        logger.error("Error processing quests:", err);
    }
}

export default definePlugin({
    name: "ZenQuests",
    description: "Automate Discord quests in the background, auto-claim rewards, and remove intrusive quest promotions",
    authors: [Devs.ZenCord],
    tags: ["Utility", "Activity"],
    enabledByDefault: true,

    settings,

    toolboxActions: {
        "⚡ Complete Active Quests": () => {
            processQuests();
            showToast({ text: "ZenQuests: Checking and completing active quests..." });
        }
    },

    patches: [
        {
            find: '"RunningGameStore"',
            group: true,
            replacement: [
                {
                    match: /}getRunningGames\(\){return/,
                    replace: "}getRunningGames(){const games=$self.getRunningGames();return games ? games : "
                },
                {
                    match: /}getGameForPID\((\i)\){/,
                    replace: "}getGameForPID($1){const pid=$self.getGameForPID($1);if(pid){return pid;}"
                }
            ]
        }
    ],

    getRunningGames() {
        if (settings.store.spoofRunningGame && fakeGamesMap.size > 0) {
            const originalGames = RunningGameStore?.getRunningGames?.() ?? [];
            return [...originalGames, ...Array.from(fakeGamesMap.values())];
        }
    },

    getGameForPID(pid: number) {
        if (settings.store.spoofRunningGame && fakeGamesMap.size > 0) {
            for (const game of fakeGamesMap.values()) {
                if (game.pid === pid) return game;
            }
        }
    },

    start() {
        if (settings.store.cleanQuestPromos) {
            document.body.classList.add("vc-zenquests-clean-ui");
        }

        if (QuestsStore?.addChangeListener) {
            QuestsStore.addChangeListener(processQuests);
        }

        // Periodic background poll every 45 seconds
        checkInterval = setInterval(processQuests, 45_000);
        setTimeout(processQuests, 5_000);
    },

    stop() {
        document.body.classList.remove("vc-zenquests-clean-ui");

        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }

        if (QuestsStore?.removeChangeListener) {
            QuestsStore.removeChangeListener(processQuests);
        }

        fakeGamesMap.clear();
    }
});
