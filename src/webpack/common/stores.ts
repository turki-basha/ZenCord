/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ConstEnumToRuntimeEnum } from "@utils/types";
import { findByCodeLazy, findByPropsLazy } from "@webpack";
import * as t from "@zencord/discord-types";
import * as enums from "@zencord/discord-types/enums";

import { waitForStore } from "./internal";

export const Flux: t.Flux = findByPropsLazy("connectStores");

export type GenericStore = t.FluxStore & Record<string, any>;

export const DraftType: ConstEnumToRuntimeEnum<typeof enums.DraftType> = findByPropsLazy("ChannelMessage", "SlashCommand");

export let MessageStore: t.MessageStore;

export let PermissionStore: t.PermissionStore;
export let GuildChannelStore: t.GuildChannelStore;
export let ReadStateStore: t.ReadStateStore;
export let PresenceStore: t.PresenceStore;
export let AccessibilityStore: t.AccessibilityStore;
export let PendingReplyStore: t.PendingReplyStore;

export let GuildStore: t.GuildStore;
export let GuildRoleStore: t.GuildRoleStore;
export let GuildScheduledEventStore: t.GuildScheduledEventStore;
export let GuildMemberCountStore: t.GuildMemberCountStore;
export let GuildMemberStore: t.GuildMemberStore;
export let UserStore: t.UserStore;
export let AuthenticationStore: t.AuthenticationStore;
export let ApplicationStore: t.ApplicationStore;
export let UserProfileStore: t.UserProfileStore;
export let SelectedChannelStore: t.SelectedChannelStore;
export let SelectedGuildStore: t.SelectedGuildStore;
export let ChannelStore: t.ChannelStore;
export let TypingStore: t.TypingStore;
export let RelationshipStore: t.RelationshipStore;
export let VoiceStateStore: t.VoiceStateStore;

export let EmojiStore: t.EmojiStore;
export let StickersStore: t.StickersStore;
export let ThemeStore: t.ThemeStore;
export let WindowStore: t.WindowStore;
export let DraftStore: t.DraftStore;
export let StreamerModeStore: t.StreamerModeStore;
export let SpotifyStore: t.SpotifyStore;

export let MediaEngineStore: t.MediaEngineStore;
export let NotificationSettingsStore: t.NotificationSettingsStore;
export let SpellCheckStore: t.SpellCheckStore;
export let UploadAttachmentStore: t.UploadAttachmentStore;
export let OverridePremiumTypeStore: t.OverridePremiumTypeStore;
export let RunningGameStore: t.RunningGameStore;
export let ActiveJoinedThreadsStore: t.ActiveJoinedThreadsStore;
export let UserGuildSettingsStore: t.UserGuildSettingsStore;
export let UserSettingsProtoStore: t.UserSettingsProtoStore;
export let CallStore: t.CallStore;
export let ChannelRTCStore: t.ChannelRTCStore;
export let FriendsStore: t.FriendsStore;
export let InstantInviteStore: t.InstantInviteStore;
export let InviteStore: t.InviteStore;
export let LocaleStore: t.LocaleStore;
export let RTCConnectionStore: t.RTCConnectionStore;
export let SoundboardStore: t.SoundboardStore;
export let PopoutWindowStore: t.PopoutWindowStore;
export let ApplicationCommandIndexStore: t.ApplicationCommandIndexStore;
export let EditMessageStore: t.EditMessageStore;
export let ExperimentStore: t.ExperimentStore;
export let UserAffinitiesStore: t.UserAffinitiesStore;
export let ApplicationStreamingStore: t.ApplicationStreamingStore;
export let ApplicationStreamPreviewStore: t.ApplicationStreamPreviewStore;
export let SortedGuildStore: t.SortedGuildStore;
export let JoinedThreadsStore: t.JoinedThreadsStore;
export let SafetyHubStore: t.SafetyHubStore;
export let PrivateChannelSortStore: t.PrivateChannelSortStore;
export let UserProfileSettingsStore: t.UserProfileSettingsStore;
export let AuthorizedAppsStore: t.AuthorizedAppsStore;
export let ChannelSectionStore: t.ChannelSectionStore;
export let ClientThemesBackgroundStore: t.ClientThemesBackgroundStore;
export let ConnectedAccountsStore: t.ConnectedAccountsStore;
export let ChannelMemberStore: t.ChannelMemberStore;
export let ThreadMemberListStore: t.ThreadMemberListStore;
export let CollapsedVoiceChannelStore: t.CollapsedVoiceChannelStore;
export let ReferencedMessageStore: t.ReferencedMessageStore;
export let SessionsStore: t.SessionsStore;
export let UserGuildJoinRequestStore: t.UserGuildJoinRequestStore;
export let SelfPresenceStore: t.SelfPresenceStore;
export let MessageRequestStore: t.MessageRequestStore;
export let GIFPickerViewStore: t.GIFPickerViewStore;
export let GuildReadStateStore: t.GuildReadStateStore;

/**
 * @see jsdoc of {@link t.useStateFromStores}
 */
export const useStateFromStores: t.useStateFromStores = findByCodeLazy("useStateFromStores");

waitForStore("AccessibilityStore", s => AccessibilityStore = s);
waitForStore("ApplicationStore", s => ApplicationStore = s);
waitForStore("AuthenticationStore", s => AuthenticationStore = s);
waitForStore("DraftStore", s => DraftStore = s);
waitForStore("UserStore", s => UserStore = s);
waitForStore("UserProfileStore", m => UserProfileStore = m);
waitForStore("ChannelStore", m => ChannelStore = m);
waitForStore("SelectedChannelStore", m => SelectedChannelStore = m);
waitForStore("SelectedGuildStore", m => SelectedGuildStore = m);
waitForStore("GuildStore", m => GuildStore = m);
waitForStore("GuildMemberStore", m => GuildMemberStore = m);
waitForStore("RelationshipStore", m => RelationshipStore = m);
waitForStore("MediaEngineStore", m => MediaEngineStore = m);
waitForStore("NotificationSettingsStore", m => NotificationSettingsStore = m);
waitForStore("SpellcheckStore", m => SpellCheckStore = m);
waitForStore("PermissionStore", m => PermissionStore = m);
waitForStore("PresenceStore", m => PresenceStore = m);
waitForStore("ReadStateStore", m => ReadStateStore = m);
waitForStore("GuildChannelStore", m => GuildChannelStore = m);
waitForStore("GuildRoleStore", m => GuildRoleStore = m);
waitForStore("GuildScheduledEventStore", m => GuildScheduledEventStore = m);
waitForStore("GuildMemberCountStore", m => GuildMemberCountStore = m);
waitForStore("MessageStore", m => MessageStore = m);
waitForStore("WindowStore", m => WindowStore = m);
waitForStore("EmojiStore", m => EmojiStore = m);
waitForStore("StickersStore", m => StickersStore = m);
waitForStore("TypingStore", m => TypingStore = m);
waitForStore("VoiceStateStore", m => VoiceStateStore = m);
waitForStore("StreamerModeStore", m => StreamerModeStore = m);
waitForStore("SpotifyStore", m => SpotifyStore = m);
waitForStore("OverridePremiumTypeStore", m => OverridePremiumTypeStore = m);
waitForStore("UploadAttachmentStore", m => UploadAttachmentStore = m);
waitForStore("RunningGameStore", m => RunningGameStore = m);
waitForStore("ActiveJoinedThreadsStore", m => ActiveJoinedThreadsStore = m);
waitForStore("UserGuildSettingsStore", m => UserGuildSettingsStore = m);
waitForStore("UserSettingsProtoStore", m => UserSettingsProtoStore = m);
waitForStore("CallStore", m => CallStore = m);
waitForStore("ChannelRTCStore", m => ChannelRTCStore = m);
waitForStore("FriendsStore", m => FriendsStore = m);
waitForStore("InstantInviteStore", m => InstantInviteStore = m);
waitForStore("InviteStore", m => InviteStore = m);
waitForStore("LocaleStore", m => LocaleStore = m);
waitForStore("RTCConnectionStore", m => RTCConnectionStore = m);
waitForStore("SoundboardStore", m => SoundboardStore = m);
waitForStore("PopoutWindowStore", m => PopoutWindowStore = m);
waitForStore("PendingReplyStore", m => PendingReplyStore = m);
waitForStore("ApplicationCommandIndexStore", m => ApplicationCommandIndexStore = m);
waitForStore("EditMessageStore", m => EditMessageStore = m);
waitForStore("ExperimentStore", m => ExperimentStore = m);
waitForStore("UserAffinitiesV2Store", m => UserAffinitiesStore = m);
waitForStore("ApplicationStreamingStore", m => ApplicationStreamingStore = m);
waitForStore("ApplicationStreamPreviewStore", m => ApplicationStreamPreviewStore = m);
waitForStore("SortedGuildStore", m => SortedGuildStore = m);
waitForStore("JoinedThreadsStore", m => JoinedThreadsStore = m);
waitForStore("SafetyHubStore", m => SafetyHubStore = m);
waitForStore("PrivateChannelSortStore", m => PrivateChannelSortStore = m);
waitForStore("UserProfileSettingsStore", m => UserProfileSettingsStore = m);
waitForStore("AuthorizedAppsStore", m => AuthorizedAppsStore = m);
waitForStore("ChannelSectionStore", m => ChannelSectionStore = m);
waitForStore("ClientThemesBackgroundStore", m => ClientThemesBackgroundStore = m);
waitForStore("ConnectedAccountsStore", m => ConnectedAccountsStore = m);
waitForStore("ChannelMemberStore", m => ChannelMemberStore = m);
waitForStore("ThreadMemberListStore", m => ThreadMemberListStore = m);
waitForStore("CollapsedVoiceChannelStore", m => CollapsedVoiceChannelStore = m);
waitForStore("ReferencedMessageStore", m => ReferencedMessageStore = m);
waitForStore("SessionsStore", m => SessionsStore = m);
waitForStore("UserGuildJoinRequestStore", m => UserGuildJoinRequestStore = m);
waitForStore("SelfPresenceStore", m => SelfPresenceStore = m);
waitForStore("MessageRequestStore", m => MessageRequestStore = m);
waitForStore("GIFPickerViewStore", m => GIFPickerViewStore = m);
waitForStore("GuildReadStateStore", m => GuildReadStateStore = m);
waitForStore("ThemeStore", m => {
    ThemeStore = m;
    // Importing this directly causes all webpack commons to be imported, which can easily cause circular dependencies.
    // For this reason, use a non import access here.
    Vencord.Api.Themes.initQuickCssThemeStore(m);
});
