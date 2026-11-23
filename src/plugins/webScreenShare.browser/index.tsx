/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { getUserSettingLazy } from "@api/UserSettings";
import { Heading } from "@components/Heading";
import {
    Divider,
    Paragraph,
    Span,
} from "@components/index";
import { Devs } from "@utils/constants";
import { classNameFactory } from "@utils/css";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import { Checkbox, closeModal, FluxDispatcher, Modal, openModal, useState } from "@webpack/common";
import { findStoreLazy } from "@webpack";
import { ApplicationStreamingSettingsStore, GoLiveQuality, GoLiveSourceOptions, MediaEngine, VideoSize, WebRTCConnection } from "@zencord/discord-types";

import managedStyle from "./styles.css?managed";

const cl = classNameFactory("vc-screen-picker-");

class NotAllowedError extends Error {
    name = "NotAllowedError";
}

const logger = new Logger("VencordScreenShare");

const ApplicationStreamingSettingsStore: ApplicationStreamingSettingsStore = findStoreLazy("ApplicationStreamingSettingsStore");

const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia;

function openScreenSharePicker(options: DisplayMediaStreamOptions) {
    return new Promise<MediaStream>((resolve, reject) => {
        const key = openModal(
            props => (
                <ModalComponent
                    modalProps={props}
                    submit={resolve}
                    options={options}
                    close={() => {
                        props.onClose();
                        reject(new NotAllowedError("Permission denied by user"));
                    }}
                />
            ),
            {
                onCloseRequest() {
                    closeModal(key);
                    reject(new NotAllowedError("Permission denied by user"));
                },
                onCloseCallback() {
                    reject(new NotAllowedError("Permission denied by user"));
                }
            }
        );
    });
}

function OptionRadio<Settings extends object, Key extends keyof Settings, Options extends ReadonlyArray<string | number>>(props: {
    options: Options;
    labels?: Array<string>;
    settings: Settings;
    settingsKey: Key;
    onChange: (option: Options[number]) => void;
}) {
    const { options, settings, settingsKey, labels, onChange } = props;

    return (
        <div className={cl("padding")}>
            <div className={cl("option-radios")}>
                {options.map((option, idx) => (
                    <label className={cl("option-radio")} data-checked={settings[settingsKey] === option} key={option}>
                        <Span weight="bold">{labels?.[idx] ?? option}</Span>
                        <input
                            type="radio"
                            name={settingsKey.toString()}
                            value={option}
                            checked={settings[settingsKey] === option}
                            onChange={() => onChange(option)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}

function ModalComponent({ modalProps, submit, close, options }: {
    modalProps: any;
    submit: (data: Promise<MediaStream>) => void;
    close: () => void;
    options: DisplayMediaStreamOptions;
}) {
    const liveSettings = settings.use();
    const disableStreamPreviewsValue = disableStreamPreviews.useSetting();
    const [quality, setQuality] = useState(() => {
        const { resolution, fps, soundshareEnabled } = ApplicationStreamingSettingsStore.getState();
        return { resolution, frameRate: fps, soundshareEnabled };
    });

    async function stream() {
        try {
            const { resolution, frameRate, soundshareEnabled } = quality;

            FluxDispatcher.dispatch({
                type: "STREAM_UPDATE_SETTINGS",
                preset: PRESET_CUSTOM,
                resolution,
                frameRate,
                soundshareEnabled
            });

            const videoOptions = typeof options?.video !== "boolean" && !!options.video ? options.video : {};
            const audioOptions = typeof options?.audio !== "boolean" && !!options.audio ? options.audio : {};
            // Discord requests a fixed size. Remove it, applyStreamQuality makes Discord limit the size to the selected quality
            delete videoOptions.width;
            delete videoOptions.height;

            submit(
                originalGetDisplayMedia.call(navigator.mediaDevices, {
                    video: {
                        ...videoOptions,
                        frameRate: { max: frameRate }
                    },
                    audio: soundshareEnabled && audioOptions,
                    systemAudio: soundshareEnabled ? "include" : "exclude",
                    selfBrowserSurface: "include",
                    surfaceSwitching: "include",
                    monitorTypeSurfaces: "include"
                }).then(stream => {
                    const [track] = stream.getVideoTracks();
                    if (track) {
                        track.contentHint = liveSettings.contentHint;
                    }
                    return stream;
                })
            );
        } catch (e) {
            logger.error("Failed to start screen share", e);
        }

        close();
    }

    return (
        <Modal
            title="Screenshare Options"
            {...modalProps}
            actions={[
                {
                    text: "Share",
                    variant: "primary",
                    onClick: stream
                },
                {
                    text: "Cancel",
                    variant: "secondary",
                    onClick: close
                }
            ]}
        >
            <Heading tag="h5">STREAM QUALITY</Heading>
            <OptionRadio
                options={StreamResolutions}
                labels={StreamResolutions.map(res => res ? `${res}p` : "Source")}
                settings={quality}
                settingsKey="resolution"
                onChange={resolution => setQuality(q => ({ ...q, resolution }))}
            />
            <Divider />
            <Heading tag="h5">FRAME RATE</Heading>
            <OptionRadio
                options={StreamFrameRates}
                labels={StreamFrameRates.map(fps => `${fps} FPS`)}
                settings={quality}
                settingsKey="frameRate"
                onChange={frameRate => setQuality(q => ({ ...q, frameRate }))}
            />
            <Divider />
            <Heading tag="h5">CONTENT HINT</Heading>
            <OptionRadio
                options={StreamContentHint}
                settings={liveSettings}
                settingsKey="contentHint"
                onChange={contentHint => settings.store.contentHint = contentHint}
            />
            <Divider />
            <div className={cl("padding")}>
                <Checkbox
                    value={quality.soundshareEnabled}
                    onChange={(_, soundshareEnabled) => setQuality(q => ({ ...q, soundshareEnabled }))}
                >
                    <Span weight="bold">Share System Audio</Span>
                </Checkbox>
            </div>
            <Divider />
            <div className={cl("padding")}>
                <Checkbox
                    value={disableStreamPreviewsValue}
                    onChange={(_, value) => disableStreamPreviews.updateSetting(value)}
                >
                    <Span weight="bold">Disable Stream Previews</Span>
                </Checkbox>
            </div>
        </Modal>
    );
}

const StreamResolutions = [0, 480, 720, 1080, 1440] as const;
const StreamFrameRates = [5, 15, 30, 60] as const;
const StreamContentHint = ["detail", "motion", "text"] as const;

const PRESET_CUSTOM = 3;

// Discord/app/modules/discord_voice/constants.js
function getBitrateMax(resolution: number, frameRate: number) {
    if (resolution <= 480) {
        return frameRate <= 15 ? 500000 : 750000;
    }
    if (resolution <= 720) {
        return frameRate <= 15 ? 1200000 : 2500000;
    }
    if (resolution <= 1080) {
        return frameRate <= 15 ? 2500000 : 4500000;
    }
    return frameRate <= 15 ? 4500000 : 8000000;
}

function applyStreamQuality(conn: WebRTCConnection, track: MediaStreamTrack, { resolution, frameRate }: GoLiveQuality) {
    const { width: trackWidth = 1280, height: trackHeight = 720 } = track.getSettings();
    // 0 is source resolution
    const height = resolution ? Math.min(resolution, trackHeight) : trackHeight;
    const width = Math.round(trackWidth * (height / trackHeight));
    const bitrateMax = getBitrateMax(height, frameRate);

    // Limit capture and encode to the selected size
    const size: VideoSize = { width, height, framerate: frameRate, pixelCount: width * height };
    conn.videoQualityManager.setGoliveQuality({ capture: size, encode: size, bitrateMax });

    const params = conn.videoStreamParameters.find(p => p.quality === 100) ?? conn.videoStreamParameters[0];
    if (params) {
        params.maxResolution = resolution
            ? { type: "fixed", width, height }
            : { type: "source", width: 0, height: 0 };
    }

    logger.info("Applied stream quality", { width, height, frameRate, bitrateMax });
}

const settings = definePluginSettings({
    contentHint: {
        type: OptionType.SELECT,
        description: "Content Hint",
        hidden: true,
        options: StreamContentHint.map(hint => ({ label: hint, value: hint, default: hint === "motion" }))
    }
});

const disableStreamPreviews = getUserSettingLazy<boolean>("voiceAndVideo", "disableStreamPreviews")!;

export default definePlugin({
    name: "WebScreenShare",
    authors: [Devs.ThaUnknown],
    description: "Adds a screenshare options menu. Allows for changing resolution, framerate, encoding hints, and system audio settings.",
    tags: ["Voice", "Utility"],
    enabledByDefault: true,
    settings,
    managedStyle,

    start() {
        if (!originalGetDisplayMedia) return;

        navigator.mediaDevices.getDisplayMedia = openScreenSharePicker;
    },
    stop() {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
    },

    patches: [
        {
            // Discord resets the streaming settings to 720p or 1080p at 30fps before it opens the picker on web, keep the saved settings
            find: ".getMediaEngine().getDesktopSource(",
            replacement: {
                match: /\(0,\i\.\i\)\(\{preset:\i\.\i\.PRESET_CUSTOM,resolution:\i\.height,frameRate:\i\.\i\.FPS_30,soundshareEnabled:!0\}\),(?=\i\.\i\.getMediaEngine\(\)\.getDesktopSource\()/,
                replace: ""
            }
        },
        {
            // Discord ignores the quality on web. It derives the quality from the track constraints, without the frame rate
            // and with a fixed bitrate, and cannot change the quality of an ongoing stream
            find: "BaseWebRTCConnection.updateVideoQuality",
            replacement: {
                // Run after the rest of setGoLiveSource, which gives the stream its desktop input
                match: /setGoLiveSource\((\i),\i\)\{(?=if\(null==\1\)this\.eachConnection\(\i=>\i\.setDesktopInput\(null\))/,
                replace: "$&queueMicrotask(()=>$self.applyGoLiveQuality(this,$1));"
            }
        },
        {
            find: "getDefaultGoliveQuality(){",
            replacement: {
                // When viewers want a smaller resolution, Discord lowers the bitrate but keeps the full encode resolution.
                // Lower the encode resolution too, like the native client does
                match: /(getGoliveQuality\(\i,(\i)\)\{.+?return new \i\(\{encode:)this\.goliveMaxQuality\.encode/,
                replace: "$1$self.scaleEncodeToSinkWants(this.goliveMaxQuality.encode,$2)"
            }
        },
        {
            // Discord shows the Stream Settings submenu only in the native client
            find: '"stream-settings-audio-enable"',
            replacement: {
                match: /\i\.isPlatformEmbedded(?=\?\(0,\i\.jsx\)\(\i\.\i,\{id:"stream-settings")/,
                replace: "true"
            }
        }
    ],

    // Discord only calls this when the viewers want fewer pixels than the encode size
    scaleEncodeToSinkWants(encode: VideoSize, sinkPixelCount: number) {
        const scale = Math.sqrt(sinkPixelCount / (encode.width * encode.height));
        return {
            ...encode,
            width: Math.round(encode.width * scale),
            height: Math.round(encode.height * scale)
        };
    },

    // Called when a stream starts and when its quality changes
    async applyGoLiveQuality(engine: MediaEngine, source: GoLiveSourceOptions | null) {
        if (!source?.desktopDescription) return;

        try {
            const connections: WebRTCConnection[] = [];
            engine.eachConnection(c => c.streamUserId === c.userId && connections.push(c as WebRTCConnection), "stream");

            for (const conn of connections) {
                const track = conn.input.getVideoStream()?.getVideoTracks()[0];
                if (!track) continue;

                // Discord limits the size in updateVideoQuality, from the capture size of applyStreamQuality
                await track.applyConstraints({ frameRate: { max: source.quality.frameRate } });
                // The streaming settings store can update after this handler, so use the requested quality
                applyStreamQuality(conn, track, source.quality);
                conn.updateVideoQuality();
                conn.handleVideo(conn.input.getVideoStreamId());
            }
        } catch (e) {
            logger.error("Failed to apply the stream quality", e);
        }
    }
});
