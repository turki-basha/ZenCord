/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const enum IpcEvents {
    INIT_FILE_WATCHERS = "ZenCordInitFileWatchers",

    OPEN_QUICKCSS = "ZenCordOpenQuickCss",
    GET_QUICK_CSS = "ZenCordGetQuickCss",
    SET_QUICK_CSS = "ZenCordSetQuickCss",
    QUICK_CSS_UPDATE = "ZenCordQuickCssUpdate",

    GET_SETTINGS = "ZenCordGetSettings",
    SET_SETTINGS = "ZenCordSetSettings",

    GET_THEMES_LIST = "ZenCordGetThemesList",
    GET_THEME_DATA = "ZenCordGetThemeData",
    GET_THEME_SYSTEM_VALUES = "ZenCordGetThemeSystemValues",
    THEME_UPDATE = "ZenCordThemeUpdate",

    OPEN_EXTERNAL = "ZenCordOpenExternal",
    OPEN_THEMES_FOLDER = "ZenCordOpenThemesFolder",
    OPEN_SETTINGS_FOLDER = "ZenCordOpenSettingsFolder",

    GET_UPDATES = "ZenCordGetUpdates",
    GET_REPO = "ZenCordGetRepo",
    UPDATE = "ZenCordUpdate",
    BUILD = "ZenCordBuild",

    OPEN_MONACO_EDITOR = "ZenCordOpenMonacoEditor",
    GET_MONACO_THEME = "ZenCordGetMonacoTheme",

    GET_PLUGIN_IPC_METHOD_MAP = "ZenCordGetPluginIpcMethodMap",

    CSP_IS_DOMAIN_ALLOWED = "ZenCordCspIsDomainAllowed",
    CSP_REMOVE_OVERRIDE = "ZenCordCspRemoveOverride",
    CSP_REQUEST_ADD_OVERRIDE = "ZenCordCspRequestAddOverride",

    GET_RENDERER_CSS = "ZenCordGetRendererCss",
    RENDERER_CSS_UPDATE = "ZenCordRendererCssUpdate",
    PRELOAD_GET_RENDERER_JS = "ZenCordPreloadGetRendererJs",

    SUPPORTS_WINDOWS_MATERIAL = "ZenCordSupportsWindowsMaterial",
}
