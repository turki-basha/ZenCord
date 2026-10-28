/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import PluginModal from "@components/settings/tabs/plugins/PluginModal";
import { promptToRestartIfDirty } from "@plugins/zenQuests/settings/restartTracking";
import { setSettingsModalOpen } from "@plugins/zenQuests/state";
import { openModal } from "@utils/modal";
import type { Plugin } from "@utils/types";

export function openZenQuestsSettingsModal(plugin: Plugin): void {
    setSettingsModalOpen(true);

    openModal(
        modalProps => (
            <PluginModal
                {...modalProps}
                plugin={plugin}
                onRestartNeeded={() => { }}
            />
        ),
        {
            onCloseCallback: () => {
                setSettingsModalOpen(false);
                promptToRestartIfDirty();
            }
        }
    );
}
