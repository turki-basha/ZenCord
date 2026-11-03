/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export namespace types {
    export interface Connection {
        conn: any;
        context?: string;
        getCodecOptions(codec: string): any;
    }
    export interface MediaEngine {
        connections?: Map<any, any>;
        emitter?: any;
    }
    export interface MediaEngineStore {
        getMediaEngine(): MediaEngine;
    }
}

