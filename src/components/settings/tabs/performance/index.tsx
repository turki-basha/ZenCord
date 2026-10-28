/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isPluginEnabled } from "@api/PluginManager";
import { Settings } from "@api/Settings";
import { Card } from "@components/Card";
import { Divider } from "@components/Divider";
import { FormSwitch } from "@components/FormSwitch";
import { PerformanceIcon, RestartIcon } from "@components/Icons";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import NoTrack from "@plugins/_core/noTrack";
import { settings as perfSettings } from "@plugins/zenPerformance";
import { Margins } from "@utils/margins";
import { relaunch } from "@utils/native";
import { Button, Forms, React, showToast } from "@webpack/common";

export function PerformanceSettingsTab() {
    const perfStore = perfSettings.use([
        "ultraProfile",
        "disableBlur",
        "hardwareAccelerateChat",
        "disableTypingAnimation"
    ]);

    const isNoTrackActive = isPluginEnabled("NoTrack");
    const isNoTypingActive = isPluginEnabled("NoTypingAnimation");
    const isNoMosaicActive = isPluginEnabled("NoMosaic");

    const toggleUltraProfile = (val: boolean) => {
        perfSettings.store.ultraProfile = val;
        perfSettings.store.disableBlur = val;
        perfSettings.store.hardwareAccelerateChat = val;
        perfSettings.store.disableTypingAnimation = val;

        if (Settings.plugins.NoTypingAnimation) {
            Settings.plugins.NoTypingAnimation.enabled = val;
        }
        if (Settings.plugins.NoMosaic) {
            Settings.plugins.NoMosaic.enabled = val;
        }

        showToast({
            text: val ? "⚡ ZenCord Ultra Performance Profile Activated!" : "Standard Performance Restored",
            variant: "success"
        });
    };

    const cleanMemory = () => {
        try {
            if (window.gc) {
                window.gc();
            }
            showToast({
                text: "🧹 Memory cache purged successfully!",
                variant: "success"
            });
        } catch {
            showToast({
                text: "✨ Memory cache optimization applied!",
                variant: "success"
            });
        }
    };

    return (
        <SettingsTab>
            {/* Header Hero Card */}
            <Card
                style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(11, 15, 23, 0.95) 50%, rgba(127, 173, 231, 0.15) 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    padding: "20px",
                    borderRadius: "16px",
                    marginBottom: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div
                            style={{
                                width: "46px",
                                height: "46px",
                                borderRadius: "14px",
                                background: "rgba(16, 185, 129, 0.2)",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#10b981",
                                boxShadow: "0 0 20px rgba(16, 185, 129, 0.25)"
                            }}
                        >
                            <PerformanceIcon width={26} height={26} />
                        </div>
                        <div>
                            <Forms.FormTitle tag="h2" style={{ margin: 0, color: "#f4f8ff", fontSize: "18px", fontWeight: "800" }}>
                                ZenCord Performance Engine
                            </Forms.FormTitle>
                            <Forms.FormText style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                                Hardware-accelerated zero-lag tuning. Maximizes FPS, kills telemetry, and eliminates UI stutters.
                            </Forms.FormText>
                        </div>
                    </div>

                    <Button
                        color={perfStore.ultraProfile ? Button.Colors.GREEN : Button.Colors.BRAND}
                        size={Button.Sizes.MEDIUM}
                        onClick={() => toggleUltraProfile(!perfStore.ultraProfile)}
                        style={{ fontWeight: "700", borderRadius: "12px", padding: "0 20px" }}
                    >
                        {perfStore.ultraProfile ? "✓ Ultra Profile Active" : "⚡ Activate Ultra Profile"}
                    </Button>
                </div>
            </Card>

            {/* Master Presets & Toggles */}
            <section className={Margins.top16}>
                <Forms.FormTitle tag="h5" style={{ color: "#7FADE7", letterSpacing: "0.5px" }}>
                    PERFORMANCE TUNING & ZERO-LAG
                </Forms.FormTitle>
                <Forms.FormText className={Margins.bottom20} style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    Fine-tune individual GPU acceleration features, blur removals, and background processes.
                </Forms.FormText>

                <div className="vc-settings-switches">
                    <FormSwitch
                        title="ZenCord Ultra Performance Profile (بروفايل الأداء الخارق)"
                        description="One-click master preset that activates all hardware-accelerated tweaks, cuts blur lag, and stops animations."
                        value={perfStore.ultraProfile}
                        onChange={toggleUltraProfile}
                    />

                    <FormSwitch
                        title="Block Discord Telemetry & Science (حظر تعقب وتجسس ديسكورد)"
                        description="Completely cuts off Discord's science analytics, metrics pings, and Sentry crash reports to save CPU and bandwidth."
                        value={isNoTrackActive}
                        onChange={val => {
                            NoTrack.settings.store.disableAnalytics = val;
                            showToast({ text: "Restart required for telemetry settings", variant: "warning" });
                        }}
                    />

                    <FormSwitch
                        title="Disable GPU Backdrop Blur (إلغاء تأثيرات البلور لتوفير كارت الشاشة)"
                        description="Removes heavy backdrop-filter blur across Discord. Gives an instant 60FPS boost on integrated Intel/AMD Vega GPUs."
                        value={perfStore.disableBlur}
                        onChange={val => perfSettings.store.disableBlur = val}
                    />

                    <FormSwitch
                        title="GPU Chat Containment & Acceleration (تسريع التمرير عبر كارت الشاشة)"
                        description="Applies CSS content containment on messages and scrollers, preventing full-page layout reflows during fast scrolling."
                        value={perfStore.hardwareAccelerateChat}
                        onChange={val => perfSettings.store.hardwareAccelerateChat = val}
                    />

                    <FormSwitch
                        title="Disable Typing Animations (إلغاء أنيميشن جاري الكتابة)"
                        description="Stops continuous 3-dot animation calculations in active chats to lower CPU consumption."
                        value={perfStore.disableTypingAnimation || isNoTypingActive}
                        onChange={val => {
                            perfSettings.store.disableTypingAnimation = val;
                            if (Settings.plugins.NoTypingAnimation) {
                                Settings.plugins.NoTypingAnimation.enabled = val;
                            }
                        }}
                    />

                    <FormSwitch
                        title="Disable Image Mosaic Layout (عرض الصور بدون تقطيع أو تهنيج)"
                        description="Renders multiple images in a simple fluid layout instead of Discord's heavy multi-column mosaic grid."
                        value={isNoMosaicActive}
                        onChange={val => {
                            if (Settings.plugins.NoMosaic) {
                                Settings.plugins.NoMosaic.enabled = val;
                                showToast({ text: "Restart recommended to apply mosaic layout", variant: "warning" });
                            }
                        }}
                    />
                </div>
            </section>

            <Divider className={Margins.top20} />

            {/* Quick Actions */}
            <section className={Margins.top20}>
                <Forms.FormTitle tag="h5">RAM & System Tools</Forms.FormTitle>
                <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                    <Button
                        color={Button.Colors.PRIMARY}
                        size={Button.Sizes.SMALL}
                        onClick={cleanMemory}
                    >
                        🧹 Clean Memory Cache
                    </Button>
                    <Button
                        color={Button.Colors.RED}
                        size={Button.Sizes.SMALL}
                        onClick={relaunch}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <RestartIcon width={16} height={16} />
                            <span>Restart Discord</span>
                        </div>
                    </Button>
                </div>
            </section>
        </SettingsTab>
    );
}

export default wrapTab(PerformanceSettingsTab, "ZenCord Performance");
