/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { fetchBuffer, fetchJson } from "@main/utils/http";
import { IpcEvents } from "@shared/IpcEvents";
import { ZENCORD_USER_AGENT } from "@shared/zencordUserAgent";
import { ipcMain } from "electron";
import { writeFile } from "fs/promises";
import { join } from "path";

import gitHash from "~git-hash";
import gitRemote from "~git-remote";

import { serializeErrors, ZENCORD_FILES } from "./common";

const API_BASE = `https://api.github.com/repos/${gitRemote}`;
let PendingUpdates = [] as [string, string][];

async function githubGet<T = any>(endpoint: string) {
    return fetchJson<T>(API_BASE + endpoint, {
        headers: {
            Accept: "application/vnd.github+json",
            // "All API requests MUST include a valid User-Agent header.
            // Requests with no User-Agent header will be rejected."
            "User-Agent": ZENCORD_USER_AGENT
        }
    });
}

async function calculateGitChanges() {
    const isOutdated = await fetchUpdates();
    if (!isOutdated) return [];

    try {
        const data = await githubGet("/releases/latest");
        let hash = "";
        if (data?.name) {
            const match = data.name.match(/\b([0-9a-f]{7,40})\b/i);
            if (match) hash = match[1];
        }
        if (!hash && data?.target_commitish) {
            hash = data.target_commitish.slice(0, 7);
        }

        const compareTarget = hash || "HEAD";
        const compareData = await githubGet(`/compare/${gitHash}...${compareTarget}`);
        if (compareData && Array.isArray(compareData.commits) && compareData.commits.length > 0) {
            return compareData.commits.map((c: any) => ({
                hash: c.sha ? c.sha.slice(0, 7) : "update",
                author: c.author?.login ?? c.commit?.author?.name ?? "ZenCord",
                message: (c.commit?.message || "ZenCord Update").split("\n")[0]
            }));
        }
    } catch { }

    return [{
        hash: "update",
        author: "ZenCord Team",
        message: "New ZenCord update available"
    }];
}

async function fetchUpdates() {
    PendingUpdates = [];
    const data = await githubGet("/releases/latest");
    if (!data) return false;

    // Try extracting commit hash from release name (e.g. "ZenCord 82431fb") or target_commitish
    let hash = "";
    if (data.name) {
        const match = data.name.match(/\b([0-9a-f]{7,40})\b/i);
        if (match) hash = match[1];
    }
    if (!hash && data.target_commitish) {
        hash = data.target_commitish.slice(0, 7);
    }

    // If we have both hashes, check if we're identical or ahead
    if (hash && gitHash) {
        if (
            hash.toLowerCase() === gitHash.toLowerCase() ||
            gitHash.toLowerCase().startsWith(hash.toLowerCase()) ||
            hash.toLowerCase().startsWith(gitHash.toLowerCase())
        ) {
            return false;
        }

        try {
            const compare = await githubGet(`/compare/${hash}...${gitHash}`);
            if (compare && (compare.status === "ahead" || compare.status === "identical")) {
                return false;
            }
        } catch { }
    } else if (!hash) {
        // If the release has no discernible hash, do not report phantom update
        return false;
    }

    if (Array.isArray(data.assets)) {
        data.assets.forEach(({ name, browser_download_url }: any) => {
            if (ZENCORD_FILES.some(s => name.startsWith(s))) {
                PendingUpdates.push([name, browser_download_url]);
            }
        });
    }

    return PendingUpdates.length > 0;
}

async function applyUpdates() {
    const fileContents = await Promise.all(PendingUpdates.map(async ([name, url]) => {
        const contents = await fetchBuffer(url);
        return [join(__dirname, name), contents] as const;
    }));

    await Promise.all(fileContents.map(async ([filename, contents]) =>
        writeFile(filename, contents))
    );

    PendingUpdates = [];
    return true;
}

ipcMain.handle(IpcEvents.GET_REPO, serializeErrors(() => `https://github.com/${gitRemote}`));
ipcMain.handle(IpcEvents.GET_UPDATES, serializeErrors(calculateGitChanges));
ipcMain.handle(IpcEvents.UPDATE, serializeErrors(fetchUpdates));
ipcMain.handle(IpcEvents.BUILD, serializeErrors(applyUpdates));
