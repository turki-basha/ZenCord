/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface EmitterEvent {
    emitter: any;
    event: any;
    fn: (...args: any[]) => any;
    plugin?: string;
}

export class Emitter {
    private static events: EmitterEvent[] = [];

    public static addListener(
        emitter: any,
        type: string,
        event: string,
        fn: (...args: any[]) => void,
        plugin?: string
    ): () => void {
        emitter[type]?.(event, fn);
        const emitterEvent: EmitterEvent = {
            emitter,
            event,
            fn,
            plugin
        };
        this.events.push(emitterEvent);

        return () => this.removeListener(emitterEvent);
    }

    public static removeListener(emitterEvent: EmitterEvent) {
        if (typeof emitterEvent.emitter?.off === "function") {
            emitterEvent.emitter.off(emitterEvent.event, emitterEvent.fn);
        } else if (typeof emitterEvent.emitter?.removeListener === "function") {
            emitterEvent.emitter.removeListener(emitterEvent.event, emitterEvent.fn);
        }
        this.events = this.events.filter(e => e !== emitterEvent);
    }

    public static removeAllListeners(plugin?: string) {
        if (!plugin) {
            this.events.forEach(e => this.removeListener(e));
        } else {
            this.events.filter(e => e.plugin === plugin).forEach(e => this.removeListener(e));
        }
    }
}

