/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export abstract class Patcher {
    protected unpatchFunctions: (() => any)[] = [];
    public abstract patch(): this;
    public abstract unpatch(): this;
    public _unpatch(): this {
        this.unpatchFunctions.forEach(fn => fn());
        this.unpatchFunctions = [];
        return this;
    }
}

