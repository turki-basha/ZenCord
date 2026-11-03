/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { filters, findByCodeLazy, mapMangledModuleLazy } from "@webpack";
import * as t from "@zencord/discord-types";

export const Modal: t.Modal = findByCodeLazy("leadingLayout:", "actions:", ".message");
export const ConfirmModal: t.ConfirmModal = findByCodeLazy("actionBarInput:", '"critical"', '"secondary');

// Modal key: "Media Viewer Modal"
export const openMediaModal: (props: t.MediaModalProps) => void = findByCodeLazy("hasMediaOptions", "shouldHideMediaOptions");

const ModalAPI: t.ModalAPI = mapMangledModuleLazy(".modalKey?", {
    openModalLazy: filters.byCode(".modalKey?"),
    openModal: filters.byCode(",instant:"),
    closeModal: filters.byCode(".onCloseCallback()"),
    closeAllModals: filters.byCode(".getState();for", " in ")
});

export const { openModalLazy, openModal, closeModal, closeAllModals } = ModalAPI;
