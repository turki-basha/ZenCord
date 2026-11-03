/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { classNameFactory } from "@utils/css";
import { showToast as originalShowToast, UserStore } from "@webpack/common";
import * as t from "@zencord/discord-types";

import { Auth } from "./auth";
import { Review, UserType } from "./entities";

export const cl = classNameFactory("vc-rdb-");

export function canDeleteReview(profileId: string, review: Review) {
    const myId = UserStore.getCurrentUser().id;
    return (
        myId === profileId
        || review.sender.discordID === myId
        || Auth.user?.type === UserType.Admin
    );
}

export function canBlockReviewAuthor(profileId: string, review: Review) {
    const myId = UserStore.getCurrentUser().id;
    return profileId === myId && review.sender.discordID !== myId;
}

export function canReportReview(review: Review) {
    return review.sender.discordID !== UserStore.getCurrentUser().id;
}

export const showToast: t.showToast = function (options) {
    options.position = options.position ?? "bottom";
    return originalShowToast(options);
};
