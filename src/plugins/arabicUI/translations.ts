/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "@api/Settings";

import rawEnglishPhrases from "./data/englishPhrases.json";
import rawPluginPacks from "./data/pluginPacks.json";

const englishPhrases = rawEnglishPhrases as Record<string, string>;
const pluginPacks = rawPluginPacks as Record<string, { name?: string; description?: string; settings?: Record<string, string> }>;

const englishLowerPhrases = new Map<string, string>();
for (const [k, v] of Object.entries(englishPhrases)) {
    englishLowerPhrases.set(k.toLowerCase(), v);
}

export function normalizeText(str: string): string {
    if (!str || typeof str !== "string") return "";
    return str
        .replace(/[\u2018\u2019]/g, "'") // curly single quotes to straight
        .replace(/[\u201C\u201D]/g, '"') // curly double quotes
        .replace(/\u2026/g, "...") // ellipsis
        .replace(/\u00A0/g, " ") // non-breaking space
        .replace(/\s+/g, " ") // collapse multi-spaces
        .trim();
}

export const discordIntlKeys: Record<string, string> = {
    "ACCOUNT": "الحساب",
    "USER_SETTINGS": "إعدادات المستخدم",
    "APP_SETTINGS": "إعدادات التطبيق",
    "FORM_LABEL_USERNAME": "اسم المستخدم",
    "FORM_LABEL_EMAIL": "البريد الإلكتروني",
    "FORM_LABEL_PHONE_NUMBER": "رقم الهاتف",
    "FORM_LABEL_PASSWORD": "كلمة المرور",
    "FORM_LABEL_DISPLAY_NAME": "الاسم الظاهر",
    "PASSWORD_AND_AUTHENTICATION": "كلمة المرور والمصادقة",
    "DEVICES": "الأجهزة",
    "CONNECTIONS": "الحسابات المرتبطة",
    "CLIPS": "المقاطع (Clips)",
    "AUTHORIZED_APPS": "التطبيقات المعتمدة",
    "SERVER_BOOST": "دعم السيرفرات (Boost)",
    "SUBSCRIPTIONS": "الاشتراكات",
    "GIFT_INVENTORY": "مخزون الهدايا",
    "BILLING": "الفواتير وطرق الدفع",
    "APPEARANCE": "المظهر",
    "ACCESSIBILITY": "إمكانية الوصول",
    "VOICE_AND_VIDEO": "الصوت والفيديو",
    "TEXT_AND_IMAGES": "النصوص والصور",
    "NOTIFICATIONS": "الإشعارات",
    "KEYBINDS": "اختصارات المفاتيح",
    "LANGUAGE": "اللغة",
    "LOG_OUT": "تسجيل الخروج",
    "SAVE_CHANGES": "حفظ التغييرات",
    "RESET": "إعادة ضبط",
    "CANCEL": "إلغاء",
    "OKAY": "حسناً",
    "CLOSE": "إغلاق",
    "EDIT": "تعديل",
    "DELETE": "حذف",
    "SHOW": "إظهار",
    "HIDE": "إخفاء"
};

export const zencordTranslations: Record<string, string> = {
    // 7 New ZenCord Plugins (Names & Descriptions)
    "DetectBlock": "كاشف البلوك (Detect Block)",
    "detectBlock": "كاشف البلوك (Detect Block)",
    "Detects users who have blocked you and warns when they appear in voice channels or group DMs.": "يكتشف المستخدمين الذين حظروك وينبهك فور دخولهم إلى الرومات الصوتية أو المجموعات المشتركة، مع شارة تنبيه وإشعار فوري.",

    "Stalker": "مراقب النشاط والأعضاء (Stalker)",
    "stalker": "مراقب النشاط والأعضاء (Stalker)",
    "Notifies you whenever a person does something.": "مراقبة نشاط أعضاء محددين وتتبع أوقات دخولهم وخروجهم من الرومات الصوتية وتغيير حالاتهم وألعابهم مع حفظ سجل كامل.",

    "StreamProof": "حماية البث والمشاركة (StreamProof)",
    "streamProof": "حماية البث والمشاركة (StreamProof)",
    "Hides messages, links, images, DMs, but not the screen share/voice grid. Toggle via chat bar button.": "إخفاء الرسائل الحساسة والبروفايل والمعلومات السرية تلقائياً وبزر سريع في شريط الدردشة أثناء مشاركة الشاشة أو البث.",

    "MicPro": "مخبر الصوت الاحترافي (MicPro)",
    "micPro": "مخبر الصوت الاحترافي (MicPro)",
    "Voice Lab engine: applies your microphone settings (gain, noise reduction, echo cancellation, AGC, sensitivity) to every call on Discord's native engine, and adds high-quality stereo transmission.": "محرّك مخبر الصوت الاحترافي: تحسين جودة المايك وبث ستيريو نقي جداً وعزل فائق للضوضاء ومنع الصدى وإلغاء قيود ديسكورد الصوتية.",

    "AudioLimiter": "محدد ومنقي الصوت (Audio Limiter)",
    "audioLimiter": "محدد ومنقي الصوت (Audio Limiter)",
    "Automatically caps the volume of other users — no more screaming or loud noises that pierce your ears.": "محدد ومنقي الصوت التلقائي: وضع سقف أعلى لارتفاع الصوت لحماية أذنيك من الصراخ والأصوات العالية والمزعجة في الرومات.",

    "VoiceGuard": "حارس الروم الصوتي (Voice Guard)",
    "voiceGuard": "حارس الروم الصوتي (Voice Guard)",
    "Resist server voice moderation: auto-rejoin, auto-unmute/undeafen, and stay in a pinned channel if moved. ⚠️ May violate Discord ToS. Use at your own risk — ZenCord disclaims all liability.": "حارس الروم الصوتي: إعادة دخول تلقائي فوري عند الطرد أو النقل من الروم، وتثبيت الروم الصوتي (Pin) وتخطي الميوت الإداري.",

    "BigFileUploadEnhanced": "رافع الملفات الكبيرة (Big File Upload)",
    "bigFileUploadEnhanced": "رافع الملفات الكبيرة (Big File Upload)",
    "Bypass Discord's upload limit by uploading files to an external server and sharing the link in chat — this version is faster and does not use DOM manipulation. ⚠️ Your files are uploaded to third-party hosts (Catbox / GoFile / Litterbox) — use at your own responsibility.": "رافع الملفات والفيديوهات الضخمة وتخطي حجم ديسكورد الصغير عبر استضافات سريعة ومجانية ومباشرة مع معاينة للصور.",

    // Core Tabs & Navigation
    "ZenCord": "زن كورد",
    "Vencord": "زن كورد",
    "ZenCord Settings": "إعدادات زن كورد",
    "Vencord Settings": "إعدادات زن كورد",
    "Plugins": "الإضافات البرمجية",
    "Themes": "الثيمات والمظاهر",
    "Performance": "الأداء والسرعة",
    "ZenCord Performance": "أداء زن كورد",
    "ZenCord Performance Engine": "محرك أداء زن كورد",
    "Updater": "محدث البرنامج",
    "Cloud": "المزامنة السحابية",
    "Backup & Restore": "النسخ الاحتياطي والاستعادة",
    "Patch Helper": "مساعد التصحيح",

    // Quick Actions
    "Quick Actions": "إجراءات سريعة",
    "Notification Log": "سجل الإشعارات",
    "Edit QuickCSS": "تعديل الـ QuickCSS",
    "Relaunch Discord": "إعادة تشغيل ديسكورد",
    "Open Settings Folder": "فتح مجلد الإعدادات",
    "View Source Code": "عرض الكود المصدري",
    "Visit Website": "زيارة الموقع الرسمي",
    "Join Discord Server": "سيرفر الدعم والمجتمع",

    // General Settings UI
    "Settings": "الإعدادات",
    "Support the Project": "دعم المشروع",
    "Contributions": "المساهمات",
    "Enable QuickCSS": "تفعيل QuickCSS",
    "Enable React DevTools": "تفعيل أدوات مطوري React",
    "Frameless Window": "نافذة بدون إطار",
    "Native Titlebar": "شريط العنوان الأصلي للويندوز",
    "Transparent Window": "نافذة شفافة",
    "Disable Min Size": "إلغاء الحد الأدنى لحجم النافذة",
    "Import Settings": "استيراد الإعدادات",
    "Export Settings": "تصدير الإعدادات",
    "Save": "حفظ",
    "Cancel": "إلغاء",
    "Reset": "إعادة ضبط",
    "Enabled": "مفعّل",
    "Disabled": "معطّل",
    "Search Plugins": "بحث في الإضافات...",
    "Search Themes": "بحث في الثيمات...",
    "Open Folder": "فتح المجلد",
    "Open CSS Editor": "فتح محرر الـ CSS",
    "Reload": "إعادة تحميل",
    "Up to date": "الإصدار محدث",
    "Update Available": "يوجد تحديث متاح",
    "Update Now": "تحديث الآن",
    "ZenCord Quick Access": "الوصول السريع لـ ZenCord",
    "ZenCord QuickCSS": "محرر الـ QuickCSS",
    "Restart Discord": "إعادة تشغيل ديسكورد",

    // Descriptions & Hints
    "You can import and export your ZenCord settings as a JSON file. This allows you to easily transfer your settings to another device, or recover your settings after reinstalling ZenCord or Discord.":
        "يمكنك استيراد وتصدير إعداداتك كملف JSON لنقلها بسهولة إلى جهاز آخر أو استعادتها لاحقاً.",
    "Fake Deafen": "ديفن وهمي (Fake Deafen)",
    "Fake Mute": "ميوت وهمي (Fake Mute)",
    "Fake Video": "كاميرا وهمية (Fake Video)",
    "Automatically fake mute whenever Fake Deafen is enabled": "تفعيل الميوت الوهمي تلقائياً عند تفعيل الديفن الوهمي",
    "Show a quick popup toast notification when toggling fake states": "إظهار إشعار سريع عند تفعيل أو تعطيل الحالة الوهمية",
    "Enable Custom CSS": "تفعيل الـ CSS المخصص",
    "Apply your configured QuickCSS": "تطبيق كود QuickCSS الذي قمت بتهيئته",
    "Block Discord Analytics": "حظر تحليلات ديسكورد",
    "Block Discord's tracking analytics. Disable this if you want badges to track your progress (eg: hours streamed).": "حظر تحليلات التتبع الخاصة بديسكورد. عطّل هذا إذا أردت للشارات تتبع تقدمك (مثل: ساعات البث).",
    "Enable the system's title bar in addition to Discord's custom one": "تفعيل شريط عنوان النظام بالإضافة إلى شريط ديسكورد المخصص",
    "Enable window transparency": "تفعيل شفافية النافذة",
    "A theme that supports transparency is required or this will do nothing. Stops the window from being resizable as a side effect": "يتطلب ثيماً يدعم الشفافية وإلا فلن يكون له تأثير. يمنع تغيير حجم النافذة كأثر جانبي",
    "Disable minimum window size": "إلغاء الحد الأدنى لحجم النافذة",
    "Allows you to resize the window to any size, even smaller than Discord's minimum size": "يتيح لك تصغير النافذة لأي مقاس حتى لو كان أصغر من الحد الأدنى لديسكورد",
    "Register Ctrl+Q as shortcut to close Discord (Alternative to Alt+F4)": "تسجيل اختصار Ctrl+Q لإغلاق ديسكورد (بديل لـ Alt+F4)",
    "Enable React Developer Tools": "تفعيل أدوات مطوري React",
    "Mainly useful for plugin developers. Ignore this if you don't know what it is": "مفيدة بالدرجة الأولى لمطوري الإضافات. تجاهلها إن لم تكن بحاجة إليها",
    "Background Material": "تأثير خلفية النافذة (Mica/Acrylic)",
    "Windows transparent background effects. You need a theme that supports transparency or this will do nothing. A restart is required after changing this setting.": "تأثيرات الشفافية لخلفية ويندوز. يلزم ثيم يدعم الشفافية. تتطلب إعادة تشغيل لتطبيق التأثير.",
    "None": "بدون",
    "Notifications": "الإشعارات",
    "Settings for Notifications sent by Vencord. This does NOT include Discord notifications (messages, etc)": "إعدادات الإشعارات الصادرة عن زنكورد. لا يشمل هذا إشعارات ديسكورد الأساسية (كالرسائل وغيرها)",
    "Notification Settings": "إعدادات الإشعارات",
    "View Notification Log": "عرض سجل الإشعارات",
    "Thank you for contributing!": "شكراً لمساهمتك!",
    "Since you've contributed to ZenCord you now have a cool new badge!": "نظراً لمساهمتك في زنكورد، حصلت الآن على شارة جديدة مميزة!",
    "See what you've contributed to": "شاهد مساهماتك",
    "Local Themes": "الثيمات المحلية",
    "Online Themes": "الثيمات الأونلاين",
    "Theme Performance": "أداء الثيمات",
    "Themes and custom CSS have the potential to cause major lag! If you experience performance issues, try disabling your themes and CSS to see if they're the cause. The most common cause of lag is the :has( ) operator.": "قد تسبب الثيمات وأكواد CSS المخصصة بطئاً ملحوظاً! إذا واجهت مشاكل في الأداء، جرب تعطيل الثيمات مؤقتاً.",
    "Find Themes:": "العثور على ثيمات:",
    "BetterDiscord theme list": "قائمة ثيمات BetterDiscord",
    "GitHub": "جيت هاب",
    "If using the BD site, click on \"Download\" and place the downloaded .theme.css file into your themes folder.": "إذا كنت تستخدم موقع BetterDiscord، اضغط تنزيل وضع ملف .theme.css داخل مجلد الثيمات.",
    "External Resources": "المصادر الخارجية",
    "For security reasons, loading resources (styles, fonts, images, ...) from most sites is blocked. Make sure all your assets are hosted on GitHub, GitLab, Codeberg, Imgur, Discord or Google Fonts.": "لدواعي الأمان، يتم حظر تحميل الموارد (الملفات، الخطوط، الصور) من معظم المواقع الخارجية غير الموثوقة.",
    "Open Themes Folder": "فتح مجلد الثيمات",
    "Load missing Themes": "إعادة فحص وتحميل الثيمات",
    "ZenCord Updater": "محدّث زنكورد",
    "Automatically update": "التحديث التلقائي",
    "Automatically update ZenCord without confirmation prompt": "تحديث زنكورد تلقائياً بدون طلب تأكيد",
    "Get notified when an automatic update completes": "إشعاري عند اكتمال التحديث التلقائي",
    "Show a notification when ZenCord automatically updates": "إظهار إشعار عند تحديث زنكورد تلقائياً في الخلفية",
    "Repo": "المستودع",
    "Updates": "التحديثات",
    "Up to Date!": "محدّث إلى آخر إصدار!",
    "Check for Updates": "التحقق من وجود تحديثات",
    "ZenCord Cloud": "سحابة زنكورد",
    "Vencord comes with a cloud integration that adds goodies like settings sync across devices. It respects your privacy, and the source code is AGPL 3.0 licensed so you can host it yourself.": "يوفر زنكورد مزامنة سحابية تتيح مزامنة الإعدادات عبر جميع أجهزتك بأمان تام واحترام كامل لخصوصيتك.",
    "Enable Cloud Integrations": "تفعيل المزامنة السحابية",
    "This will request authorization if you have not yet set up cloud integrations.": "سيطلب هذا تفويضاً إذا لم تكن قد قمت بإعداد المزامنة السحابية بعد.",
    "Backend URL": "رابط السيرفر السحابي (Backend URL)",
    "Which backend to use when using cloud integrations.": "الخادم السحابي المستخدم لمزامنة الإعدادات.",
    "Reauthorise": "إعادة التفويض",
    "Settings Sync": "مزامنة الإعدادات",
    "Enable Settings Sync": "تفعيل مزامنة الإعدادات",
    "Save your ZenCord settings to the cloud so you can easily keep them the same on all your devices": "احفظ إعدادات زنكورد سحابياً لتبقى متطابقة بسهولة على كل أجهزتك",
    "Sync Rules for This Device": "قواعد المزامنة لهذا الجهاز",
    "This setting controls how settings move between this device and the cloud. You can let changes flow both ways, or choose one place to be the main source of truth.": "يحدد هذا الخيار كيفية انتقال الإعدادات بين هذا الجهاز والسحابة (بالاتجاهين أو باتجاه واحد).",
    "Two-way sync (changes go both directions)": "مزامنة بالاتجاهين (إرسال واستقبال التغييرات)",
    "Upload Settings": "رفع الإعدادات إلى السحابة",
    "Download Settings": "تحميل الإعدادات من السحابة",
    "Reset Cloud Data": "إعادة ضبط البيانات السحابية",
    "Delete Settings from Cloud": "حذف الإعدادات من السحابة",
    "Delete your Cloud Account": "حذف حسابك السحابي نهائياً"
};

export const discordSettingsTranslations: Record<string, string> = {
    // Left Sidebar Categories (User Settings)
    "USER SETTINGS": "إعدادات المستخدم",
    "User Settings": "إعدادات المستخدم",
    "My Account": "حسابي",
    "Profiles": "الملفات الشخصية",
    "User Profile": "الملف الشخصي",
    "Server Profiles": "الملفات الشخصية بالسيرفرات",
    "Privacy & Safety": "الخصوصية والأمان",
    "Authorized Apps": "التطبيقات المعتمدة",
    "Devices": "الأجهزة المتصلة",
    "Connections": "الحسابات المرتبطة",
    "Clips": "المقاطع (Clips)",
    "Friend Requests": "طلبات الصداقة",

    // Billing Categories
    "BILLING SETTINGS": "إعدادات الفوترة والاشتراكات",
    "Server Boost": "دعم السيرفرات (Boost)",
    "Subscriptions": "الاشتراكات",
    "Gift Inventory": "مخزون الهدايا",
    "Billing": "الفواتير وطرق الدفع",

    // App Settings Categories
    "APP SETTINGS": "إعدادات التطبيق",
    "Appearance": "المظهر",
    "Accessibility": "إمكانية الوصول",
    "Voice & Video": "الصوت والفيديو",
    "Text & Images": "النصوص والصور",
    "Notifications": "الإشعارات",
    "Keybinds": "اختصارات المفاتيح",
    "Language": "اللغة",
    "Windows Settings": "إعدادات ويندوز",
    "Linux Settings": "إعدادات لينكس",
    "Streamer Mode": "وضع البث (Streamer Mode)",

    // Activity Settings Categories
    "ACTIVITY SETTINGS": "إعدادات النشاط",
    "Registered Games": "الألعاب المسجلة",
    "Log Out": "تسجيل الخروج",
    "Logging Out": "جارٍ تسجيل الخروج...",

    // My Account Section
    "Display Name": "الاسم الظاهر",
    "Password and Authentication": "كلمة المرور والمصادقة",
    "Change Password": "تغيير كلمة المرور",
    "Current Password": "كلمة المرور الحالية",
    "New Password": "كلمة المرور الجديدة",
    "Confirm Password": "تأكيد كلمة المرور",
    "Two-Factor Authentication": "المصادقة الثنائية (2FA)",
    "Enable Two-Factor Auth": "تفعيل المصادقة الثنائية",
    "View Backup Codes": "عرض رموز النسخ الاحتياطي",
    "Account Removal": "حذف أو تعطيل الحساب",

    // Profiles Section
    "About Me": "نبذة عني",
    "Pronouns": "الضمائر",
    "Avatar": "الصورة الرمزية",
    "Profile Banner": "بانر الملف الشخصي",
    "Change Avatar": "تغيير الصورة الرمزية",
    "Remove Avatar": "إزالة الصورة الرمزية",
    "Change Banner": "تغيير البانر",
    "Profile Theme": "سمة الملف الشخصي",
    "Primary Color": "اللون الأساسي",
    "Accent Color": "اللون الثانوي",
    "Custom Status": "الحالة المخصصة",
    "Preview": "معاينة",

    // Appearance Section
    "THEME": "المظهر العام",
    "Theme": "المظهر العام",
    "Dark": "داكن",
    "Light": "فاتح",
    "Midnight": "أسود حالك (Midnight)",
    "Darker": "داكن أكثر",
    "Sync with computer": "مزامنة مع إعدادات الجهاز",
    "MESSAGE DISPLAY": "طريقة عرض الرسائل",
    "Message Display": "طريقة عرض الرسائل",
    "Cozy": "مريح (مع الصور الرمزية)",
    "Compact": "مدمج (مساحة أقل)",
    "CHAT FONT SCALING": "حجم خط المحادثة",
    "Chat Font Scaling": "حجم خط المحادثة",
    "SPACE BETWEEN MESSAGE GROUPS": "المسافة بين مجموعات الرسائل",
    "Space Between Message Groups": "المسافة بين مجموعات الرسائل",
    "ZOOM LEVEL": "مستوى التكبير",
    "Zoom Level": "مستوى التكبير",

    // Voice & Video Section
    "VOICE SETTINGS": "إعدادات الصوت",
    "INPUT DEVICE": "جهاز الإدخال (الميكروفون)",
    "OUTPUT DEVICE": "جهاز الإخراج (السماعات)",
    "Input Device": "جهاز الإدخال (الميكروفون)",
    "Output Device": "جهاز الإخراج (السماعات)",
    "INPUT VOLUME": "مستوى صوت الميكروفون",
    "OUTPUT VOLUME": "مستوى صوت السماعات",
    "Input Volume": "مستوى صوت الميكروفون",
    "Output Volume": "مستوى صوت السماعات",
    "MIC TEST": "اختبار الميكروفون",
    "Mic Test": "اختبار الميكروفون",
    "Let's Check": "بدء الفحص",
    "Stop Testing": "إيقاف الفحص",
    "INPUT MODE": "وضع الإدخال",
    "Input Mode": "وضع الإدخال",
    "Voice Activity": "التحسس الصوتي التلقائي",
    "Push to Talk": "الضغط للتحدث (Push to Talk)",
    "Shortcut": "زر الاختصار",
    "Record Keybind": "تسجيل الاختصار",
    "Automatically determine input sensitivity": "تحديد حساسية الميكروفون تلقائياً",
    "VIDEO SETTINGS": "إعدادات الفيديو والكاميرا",
    "CAMERA": "الكاميرا",
    "Camera": "الكاميرا",
    "Test Video": "اختبار الكاميرا",
    "ADVANCED": "خيارات متقدمة",
    "Echo Cancellation": "إلغاء صدى الصوت",
    "Noise Suppression": "حجب الضوضاء",
    "Advanced Voice Activity": "التحسس الصوتي المتقدم",
    "Automatic Gain Control": "التحكم التلقائي بمستوى الصوت",
    "Attenuation": "خفض أصوات البرامج الأخرى",
    "Audio Subsystem": "النظام الصوتي الفرعي",

    // Text & Images Section
    "Display images, videos, and lolcats": "عرض الصور ومقاطع الفيديو والوسائط",
    "When uploaded directly to Discord": "عند الرفع المباشر إلى ديسكورد",
    "When posted as links to chat": "عند النشر كروابط في المحادثة",
    "Show embeds and website preview info from links": "إظهار المعاينات ومعلومات الروابط",
    "Show emoji reactions on messages": "إظهار التفاعلات على الرسائل",
    "Automatically convert emoticons in your messages to emoji": "تحويل الرموز التعبيرية تلقائياً إلى إيموجي",

    // Notifications Section
    "Inactive Timeout": "مهلة عدم النشاط",

    // Keybinds Section
    "Keyboard Shortcuts": "اختصارات لوحة المفاتيح",
    "Add a Keybind": "إضافة اختصار جديد",
    "Action": "الإجراء",
    "Keybind": "زر الاختصار",

    // Windows Settings Section
    "Open Discord": "فتح ديسكورد عند تشغيل الجهاز",
    "Start Minimized": "البدء مصغراً في الخلفية",
    "Minimize to Tray": "التصغير إلى شريط المهام (Tray)",

    // Advanced Section
    "Developer Mode": "وضع المطورين (Developer Mode)",
    "Hardware Acceleration": "تسريع العتاد (Hardware Acceleration)",
    "Application Test Mode": "وضع اختبار التطبيقات",

    // Common Buttons & Modals inside Settings
    "Save Changes": "حفظ التغييرات",
    "Reset": "إعادة ضبط",
    "Cancel": "إلغاء",
    "Confirm": "تأكيد",
    "Done": "تم",
    "Close": "إغلاق",
    "Back": "رجوع",
    "Next": "التالي",
    "Okay": "حسناً",
    "Got It": "فهمت ذلك",
    "Learn More": "معرفة المزيد",
    "Are you sure?": "هل أنت متأكد؟",
    "Delete": "حذف",
    "Remove": "إزالة",
    "Enable": "تفعيل",
    "Disable": "تعطيل",
    "ESC": "خروج (ESC)",

    // Password & Security & Account Details
    "Standing": "حالة الحساب",
    "Good": "جيدة",
    "All good! You don't have any active violations.": "كل شيء على ما يرام! ليس لديك أي مخالفات نشطة.",
    "View Standing Details": "عرض تفاصيل حالة الحساب",
    "Security": "الأمان",
    "Security Keys": "مفاتيح الأمان",
    "Authenticator App": "تطبيق المصادقة",
    "SMS Backup Authentication": "المصادقة الاحتياطية عبر الرسائل القصيرة (SMS)",
    "Backup Codes": "رموز النسخ الاحتياطي",
    "Disabling your account means you can recover it at any time after taking this action.": "تعطيل حسابك يعني أنه يمكنك استعادته في أي وقت لاحقاً.",

    // Windows & System Settings
    "General": "عام",
    "Automatically open Discord when your computer starts up": "تشغيل ديسكورد تلقائياً عند بدء تشغيل الكمبيوتر",
    "Start Discord minimized": "تشغيل ديسكورد مصغراً",
    "Start Discord in the background, out of your way.": "تشغيل ديسكورد في الخلفية لتجنب مقاطعتك.",
    "Minimize Discord to System Tray": "تصغير ديسكورد إلى شريط المهام (System Tray)",
    "Clicking X minimizes Discord instead of closing it completely.": "الضغط على زر X يقوم بتصغير ديسكورد بدلاً من إغلاقه بالكامل.",
    "Enable Hardware Acceleration": "تفعيل تسريع العتاد (Hardware Acceleration)",
    "Uses your GPU to make Discord run more smoothly. Turn this off if you're experiencing visual glitches like frame drops in games or performance problems.": "يستخدم بطاقة الرسوميات (GPU) لجعل ديسكورد يعمل بسلاسة أكبر. عطل هذا الخيار إذا واجهت مشاكل أو انخفاضاً في الإطارات أثناء الألعاب.",

    // Custom Keybinds Section
    "Custom Keybinds": "اختصارات المفاتيح المخصصة",
    "Keybinds are custom keyboard shortcuts that let you perform specific actions in Discord without needing to click through menus.": "اختصارات المفاتيح هي اختصارات لوحة مفاتيح مخصصة تتيح لك تنفيذ إجراءات محددة في ديسكورد بضغطة زر دون الحاجة للتنقل عبر القوائم.",
    "Keybinds are disabled while this page is visible.": "يتم تعطيل اختصارات المفاتيح مؤقتاً أثناء التواجد في هذه الصفحة.",
    "Keybind Action": "إجراء الاختصار",
    "Edit Keybind": "تعديل الاختصار",
    "Add Keybind": "إضافة اختصار",
    "Save Clip": "حفظ كليب",
    "Clips the last 30 seconds to 2 minutes of your stream, depending on your settings.": "يقوم بحفظ آخر 30 ثانية إلى دقيقتين من البث، حسب إعداداتك.",
    "Unassigned": "غير محدد",
    "Push to Talk (Normal)": "الضغط للتحدث (عادي)",
    "Push to Talk (Priority)": "الضغط للتحدث (أولوية)",
    "Push to Mute": "الضغط لكتم الصوت",
    "Toggle Mute": "تبديل كتم الصوت (ميوت)",
    "Toggle Deafen": "تبديل تعطيل السمع (ديفن)",
    "Toggle Streamer Mode": "تبديل وضع البث",
    "Toggle Overlay": "تبديل الأوفرلاي (Overlay)",
    "Toggle Overlay Lock": "قفل الأوفرلاي",
    "Activate Overlay Chat": "تفعيل شات الأوفرلاي",
    "Toggle Screen Share": "تبديل مشاركة الشاشة",
    "Navigate back": "الرجوع للخلف",
    "Navigate forward": "التقدم للأمام",

    // Profiles Section
    "You can use markdown and links if you'd like.": "يمكنك استخدام تنسيقات Markdown والروابط إذا أردت.",
    "Avatar Decoration": "زينة الصورة الرمزية",
    "Change Decoration": "تغيير الزينة",
    "Profile Effect": "تأثير الملف الشخصي",
    "Change Effect": "تغيير التأثير",
    "Choose a server to customize your profile for that server.": "اختر سيرفراً لتخصيص ملفك الشخصي داخله فقط.",
    "Primary": "الأساسي",
    "Accent": "الثانوي",

    // Voice & Video Section
    "Voice Processing": "معالجة الصوت",
    "Having mic issues? Check our guide": "هل تواجه مشاكل في الميكروفون؟ راجع دليل المساعدة",
    "Standard": "قياسي",
    "Legacy": "قديم",
    "Experimental": "تجريبي",

    // Privacy & Safety Section
    "Direct Message Safety": "أمان الرسائل المباشرة",
    "Filter direct messages from non-friends": "تصفية الرسائل المباشرة من غير الأصدقاء",
    "Filter all direct messages": "تصفية جميع الرسائل المباشرة",
    "Do not filter direct messages": "عدم تصفية الرسائل المباشرة",
    "Server Privacy Defaults": "إعدادات خصوصية السيرفرات الافتراضية",
    "Allow direct messages from server members": "السماح بالرسائل المباشرة من أعضاء السيرفر",
    "Allow activity status to show in servers": "إظهار حالة النشاط داخل السيرفرات",
    "How We Use Your Data": "كيفية استخدام بياناتك",
    "Use data to customize my Discord experience": "استخدام البيانات لتخصيص تجربتك",

    // Accessibility Section
    "Saturation": "تشبع الألوان",
    "Role Colors": "ألوان الرتب",
    "Show role colors in names": "إظهار ألوان الرتب على الأسماء",
    "Show role colors next to names": "إظهار ألوان الرتب بجانب الأسماء",
    "Don't show role colors": "عدم إظهار ألوان الرتب",
    "Reduced Motion": "تقليل الحركة والانتقالات",
    "Enable Reduced Motion": "تفعيل تقليل الحركة",
    "Sync with computer settings": "مزامنة مع إعدادات النظام",
    "Stickers": "الستيكرات",
    "Always animate": "متحركة دائماً",
    "Animate on interaction": "التحريك عند التفاعل أو التحويم",
    "Never animate": "عدم التحريك إطلاقاً",
    "Text-to-Speech Rate": "سرعة قراءة النصوص (TTS)",

    // Devices Section
    "Log Out All Known Devices": "تسجيل الخروج من جميع الأجهزة المعروفة",
    "Current Device": "الجهاز الحالي",
    "Log Out of Device": "تسجيل الخروج من هذا الجهاز",

    // Clips Section
    "Enable Clips": "تفعيل المقاطع (Clips)",
    "Clip Length": "مدة المقطع",
    "Resolution": "دقة الفيديو",
    "Frame Rate": "معدل الإطارات (FPS)",
    "Record Audio": "تسجيل الصوت",

    // Billing & Subscriptions Section
    "Payment Methods": "طرق الدفع",
    "Add Payment Method": "إضافة طريقة دفع",
    "Billing History": "سجل الفواتير",
    "Transaction History": "سجل المعاملات",
    "Redeem Codes": "استرداد الرموز",
    "Account": "الحساب",
    "Account Info": "معلومات الحساب",
    "Password & Security": "كلمة المرور والأمان",
    "Account Status": "حالة الحساب",
    "Family Center": "مركز العائلة",
    "Data & Privacy": "البيانات والخصوصية",
    "Messaging Permissions": "أذونات المراسلة",
    "Search": "بحث",
    "Username": "اسم المستخدم",
    "Email": "البريد الإلكتروني",
    "Phone Number": "رقم الهاتف",
    "Reveal": "إظهار",
    "Hide": "إخفاء",
    "Edit": "تعديل",
    "Password": "كلمة المرور",
    "Multi-Factor Authentication": "المصادقة الثنائية (2FA)",
    "Enabled": "مفعّل",
    "Disabled": "معطّل",
    "Logged-in Devices": "الأجهزة المسجلة",
    "Age Group": "الفئة العمرية",
    "Adult": "بالغ",
    "You're in the adult age group (18+) and have access to age-restricted content, spaces, and settings.": "أنت في الفئة العمرية للبالغين (+18) ولديك حق الوصول إلى المحتوى والمساحات والإعدادات المقيدة بالفئة العمرية.",
    "Account Standing": "سجل الحساب",
    "All good": "كل شيء على ما يرام",
    "Thank you for upholding Discord's Terms of Service and Community Guidelines. If you have a violation, it will appear here.": "شكراً لالتزامك بشروط خدمة ديسكورد وإرشادات المجتمع. إذا كانت لديك أي مخالفة فستظهر هنا.",
    "Set up Family Center": "إعداد مركز العائلة",
    "Stay informed about your teen's experience on Discord. See their activity, manage key safety settings, and start better conversations together.": "ابق على اطلاع بتجربة ابنك المراهق على ديسكورد. شاهد نشاطه، وقم بإدارة إعدادات الأمان الأساسية، وابدأ محادثات أفضل معاً.",
    "Disable your account": "تعطيل حسابك",
    "Temporarily disable your account.": "تعطيل حسابك مؤقتاً.",
    "Disable Account": "تعطيل الحساب",
    "Close your account": "إغلاق حسابك",
    "Permanently close your account.": "إغلاق وحذف حسابك نهائياً.",
    "Delete Account": "حذف الحساب",
    "How Discord Uses My Data": "كيف يستخدم ديسكورد بياناتي",
    "Use data to make Discord work": "استخدام البيانات لتشغيل ديسكورد",
    "Discord needs to store and process some data in order to provide you the basic Discord service, such as your messages, what servers you're in and your Direct Messages. By using Discord, you allow Discord to provide this basic service. You can stop this by Disabling or Deleting your account.": "يحتاج ديسكورد إلى تخزين بعض البيانات ومعالجتها لتوفير الخدمة الأساسية لك، مثل رسائلك، والسيرفرات التي تتواجد فيها، والرسائل المباشرة. باستخدام ديسكورد، فإنك تسمح له بتوفير هذه الخدمة. يمكنك إيقاف ذلك عبر تعطيل أو حذف حسابك.",
    "Disabling": "تعطيل",
    "Deleting": "حذف",
    "Use data to improve Discord": "استخدام البيانات لتحسين ديسكورد",
    "Allow Discord to use and process my information to understand and improve Discord's services.": "السماح لديسكورد باستخدام معلوماتي ومعالجتها لفهم خدمات ديسكورد وتحسينها.",
    "Learn more": "معرفة المزيد",
    "Use data to personalize my Discord experience": "استخدام البيانات لتخصيص تجربتي على ديسكورد",
    "Allows Discord to use information, such as who you talk to and what games you play, to personalize Discord for you.": "يسمح لديسكورد باستخدام معلومات مثل من تتحدث معهم والألعاب التي تلعبها لتخصيص تجربتك على ديسكورد.",
    "Allows Discord to use information, such as who you talk to and what games you play, to personalize Discord for you. Learn more": "يسمح لديسكورد باستخدام معلومات مثل من تتحدث معهم والألعاب التي تلعبها لتخصيص تجربتك على ديسكورد.",
    "Use my Discord activity to personalize Sponsored Content": "استخدام نشاطي على ديسكورد لتخصيص المحتوى الممول",
    "Allows Discord to personalize Sponsored Content, like Quests, using your Discord activity, such as the games you play. If you opt out you may still see Quests, but they won't be personalized.": "يسمح لديسكورد بتخصيص المحتوى الممول (مثل المهام Quests) باستخدام نشاطك، كالألعاب التي تلعبها. إذا قمت بالإلغاء، فقد تظل ترى المهام ولكن لن يتم تخصيصها لك.",
    "Use third-party data to personalize Sponsored Content": "استخدام بيانات أطراف ثالثة لتخصيص المحتوى الممول",
    "Allows Discord to personalize Sponsored Content, like Quests, using data Discord receives from advertisers and third-party data providers. If you opt out, you may still see Quests, but they won't be personalized using data from third parties. Learn more": "يسمح لديسكورد بتخصيص المحتوى الممول، مثل المهام، باستخدام البيانات التي يتلقاها من المعلنين وموفري البيانات الخارجيين.",
    "Show my message content from Discoverable channels on web pages": "إظهار محتوى رسائلي من القنوات القابلة للاكتشاف على صفحات الويب",
    "Allow message content that you send in Discoverable channels to appear on web pages. Admins of Discoverable servers control which channels are Discoverable. These messages will appear as you wrote them, but won't show your username. Learn more": "السماح لمحتوى الرسائل التي ترسلها في القنوات القابلة للاكتشاف بالظهور على صفحات الويب. يتحكم مسؤولو السيرفرات القابلة للاكتشاف بالقنوات المتاحة.",
    "Allow my voice to be recorded in Clips": "السماح بتسجيل صوتي في المقاطع (Clips)",
    "Allows your voice to be included when someone in the same voice channel uses Clips.": "يسمح بتضمين صوتك عندما يقوم شخص ما في نفس القناة الصوتية باستخدام ميزة المقاطع (Clips).",
    "Request my data": "طلب بياناتي",
    "If you need a copy of your personal data from your account's entire history, you can get it here. Learn more about how getting a copy of your data works.": "إذا كنت بحاجة إلى نسخة من بياناتك الشخصية من تاريخ حسابك بالكامل، يمكنك الحصول عليها من هنا.",
    "Request Data": "طلب البيانات",
    "Profile Privacy": "خصوصية الملف الشخصي",
    "Control who can see your profile info — like your bio and connected accounts. Learn more": "تحكم في من يمكنه رؤية معلومات ملفك الشخصي — مثل النبذة التعريفية والحسابات المرتبطة.",
    "Control who can see your profile info — like your bio and connected accounts.": "تحكم في من يمكنه رؤية معلومات ملفك الشخصي — مثل النبذة التعريفية والحسابات المرتبطة.",
    "Share my full profile with": "مشاركة ملفي الشخصي بالكامل مع",
    "Friends & All Servers": "الأصدقاء وجميع السيرفرات",
    "Your full profile is visible to friends and any server you join.": "ملفك الشخصي بالكامل مرئي لأصدقائك ولأي سيرفر تنضم إليه.",
    "Friends & Small Servers Only": "الأصدقاء والسيرفرات الصغيرة فقط",
    "Your full profile is visible to friends and any server you join with 200 or fewer members. Everyone else sees a limited version.": "ملفك الشخصي بالكامل مرئي لأصدقائك وفي أي سيرفر تنضم إليه يضم 200 عضو أو أقل. يرى البقية نسخة محدودة.",
    "Friends Only": "الأصدقاء فقط",
    "Your full profile is visible to friends. Everyone else sees a limited version.": "ملفك الشخصي بالكامل مرئي لأصدقائك فقط. يرى الآخرون نسخة محدودة.",
    "Share when I update my profile": "المشاركة عند تحديث ملفي الشخصي",
    "Allow friends to receive a push notification when you update your profile.": "السماح للأصدقاء بتلقي إشعار عند قيامك بتحديث ملفك الشخصي.",
    "Related Settings": "إعدادات ذات صلة",
    "Activity Privacy": "خصوصية النشاط",
    "Control how your game and app activity is shared—what's visible and who sees it.": "تحكم في كيفية مشاركة نشاط ألعابك وتطبيقاتك — ما هو مرئي ومن يراه.",
    "Voice End-to-end Encryption": "التشفير التام بين الأطراف للصوت",
    "Enable persistent verification codes": "تفعيل رموز التحقق الدائمة",
    "Gives your current device persistent verification codes. If this setting is on, your friends only have to verify your device once, instead of every time you enter a voice call. Learn more": "يمنح جهازك الحالي رموز تحقق دائمة لتجنب التحقق في كل مرة.",
    "Gives your current device persistent verification codes. If this setting is on, your friends only have to verify your device once, instead of every time you enter a voice call.": "يمنح جهازك الحالي رموز تحقق دائمة لتجنب التحقق في كل مرة.",
    "Content Filters": "فلاتر المحتوى",
    "Sensitive content filters": "فلاتر المحتوى الحساس",
    "Choose how you want to see image-based media detected by Discord's sensitive content filters. Learn more": "اختر كيف تريد رؤية الوسائط الصورية المكتشفة بواسطة فلاتر المحتوى الحساس لديسكورد.",
    "Choose how you want to see image-based media detected by Discord's sensitive content filters.": "اختر كيف تريد رؤية الوسائط الصورية المكتشفة بواسطة فلاتر المحتوى الحساس لديسكورد.",
    "Mature Sexual Media": "محتوى جنسي للبالغين",
    "Graphic Media": "محتوى عنيف وصادم",
    "Direct messages from friends": "الرسائل المباشرة من الأصدقاء",
    "Direct messages from others": "الرسائل المباشرة من الآخرين",
    "Messages in server channels": "الرسائل في قنوات السيرفر",
    "Show": "إظهار",
    "Block": "حظر",
    "Blur": "تعتيم (Blur)",
    "Helps detect image-based media that may contain sexually explicit or suggestive material involving adults.": "يساعد في اكتشاف الوسائط الصورية التي قد تحتوي على مواد جنسية صريحة أو إيحائية تتعلق بالبالغين.",
    "Allow access to age-restricted commands from apps in DMs": "السماح بالوصول إلى أوامر التطبيقات المقيدة بالعمر في الخاص",
    "Allows people 18+ to access commands marked as age-restricted in DMs. Applies to all apps.": "يسمح للأشخاص فوق 18 عاماً بالوصول إلى الأوامر المقيدة بالعمر في الرسائل الخاصة. ينطبق على جميع التطبيقات.",
    "Allow access to age-restricted servers on iOS": "السماح بالوصول إلى السيرفرات المقيدة بالعمر على iOS",
    "Access age-restricted servers (18+) on iOS devices, after joining them on desktop.": "الوصول إلى السيرفرات المقيدة بالعمر (+18) على أجهزة iOS، بعد الانضمام إليها من الكمبيوتر.",
    "Spam Filters": "فلاتر الرسائل المزعجة (Spam)",
    "Automatically filter suspected spam messages": "تصفية الرسائل المشتبه بأنها عشوائية أو مزعجة تلقائياً",
    "Discord can filter out some messages that contain spam. These messages go to your Spam inbox.": "يمكن لديسكورد تصفية بعض الرسائل التي تحتوي على سبام وإرسالها إلى صندوق الرسائل المزعجة.",
    "Filter all spam": "تصفية جميع الرسائل المزعجة",
    "Filter messages from non-friends (Recommended)": "تصفية الرسائل من غير الأصدقاء (مستحسن)",
    "Don't filter spam": "عدم تصفية الرسائل المزعجة",
    "Direct Message (DM) Permissions": "أذونات الرسائل المباشرة (الخاص)",
    "All servers": "جميع السيرفرات",
    "Direct Messages": "الرسائل المباشرة",
    "Allow DMs from other server members": "السماح بالرسائل المباشرة من أعضاء السيرفر الآخرين",
    "Message requests": "طلبات الرسائل",
    "Filter messages from server members you may not know. Learn more": "تصفية الرسائل من أعضاء السيرفر الذين قد لا تعرفهم.",
    "Filter messages from server members you may not know.": "تصفية الرسائل من أعضاء السيرفر الذين قد لا تعرفهم.",
    "Friend Request Permissions": "أذونات طلبات الصداقة",
    "Control who can send you friend requests and how they appear.": "تحكم في من يمكنه إرسال طلبات الصداقة إليك وكيفية ظهورها.",
    "Allow Friend Requests from...": "السماح بطلبات الصداقة من...",
    "Everyone": "الجميع",
    "Friend of friends": "أصدقاء الأصدقاء",
    "Friends of friends": "أصدقاء الأصدقاء",
    "Server members": "أعضاء السيرفر",
    "Server members can only send you friend requests from servers where you also allow Direct Messages.": "يمكن لأعضاء السيرفر إرسال طلبات صداقة إليك فقط من السيرفرات التي تسمح فيها أيضاً بالرسائل المباشرة.",
    "Show personalized messages": "إظهار رسائل مخصصة",
    "Show personalized messages on incoming friend requests. If you accept, the message will still appear in your DMs.": "إظهار رسائل مخصصة مع طلبات الصداقة الواردة. إذا قبلت، فستظل الرسالة تظهر في رسائلك الخاصة.",
    "Messaging in Connected Games": "المراسلة في الألعاب المتصلة",
    "These are settings for games that use Discord to power their social experiences.": "هذه إعدادات للألعاب التي تستخدم ديسكورد لتشغيل تجاربها الاجتماعية.",
    "No games Connected": "لا توجد ألعاب متصلة",
    "Want to connect a game to your account? Learn more": "هل تريد ربط لعبة بحسابك؟ معرفة المزيد",
    "Want to connect a game to your account?": "هل تريد ربط لعبة بحسابك؟",
    "Manage your games in Authorized Apps": "إدارة ألعابك في التطبيقات المعتمدة",
    "Ignore & Block": "التجاهل والحظر",
    "You’re in control. To compare your options for reducing unwanted interactions, explore our feature guide": "أنت صاحب القرار. لمقارنة خياراتك لتقليل التفاعلات غير المرغوب فيها، استكشف دليل الميزات.",
    "You're in control. To compare your options for reducing unwanted interactions, explore our feature guide": "أنت صاحب القرار. لمقارنة خياراتك لتقليل التفاعلات غير المرغوب فيها، استكشف دليل الميزات.",
    "Blocked accounts": "الحسابات المحظورة",
    "Unblock": "إلغاء الحظر",
    "See 5 more": "عرض 5 حسابات أخرى",
    "See more": "عرض المزيد",
    "Overview": "نظرة عامة",
    "Enable Desktop Notifications": "تفعيل إشعارات سطح المكتب",
    "If you're looking for per-channel or per-server notifications, right-click the desired server icon and select Notification Settings.": "إذا كنت تبحث عن إشعارات مخصصة لكل قناة أو سيرفر، فانقر بزر الماوس الأيمن على أيقونة السيرفر وحدد إعدادات الإشعارات.",
    "Enable Taskbar Flashing": "تفعيل وميض شريط المهام",
    "Flashes the app in your taskbar when you have new notifications.": "يومض التطبيق في شريط المهام عند وصول إشعارات جديدة.",
    "Notify me when...": "إشعاري عندما...",
    "People I know start streaming in small servers": "يبدأ أشخاص أعرفهم بالبث المباشر في سيرفرات صغيرة",
    "A friend and I reach a friendship anniversary": "أصل أنا وصديق إلى ذكرى صداقة سنوية",
    "Friends come online": "يتصل الأصدقاء بالإنترنت",
    "A server has an upcoming event": "يقترب موعد فعالية في سيرفر",
    "Friends update their profile": "يقوم الأصدقاء بتحديث ملفهم الشخصي",
    "Someone reacts to my messages": "يتفاعل شخص ما مع رسائلي",
    "All Messages": "جميع الرسائل",
    "Sounds": "الأصوات",
    "Enable 🎃 Halloween Sound Pack": "تفعيل حزمة أصوات 🎃 الهالوين",
    "New Message": "رسالة جديدة",
    "Preview Sound": "معاينة الصوت",
    "New Message in the channel I'm currently reading": "رسالة جديدة في القناة التي أقرؤها حالياً",
    "Incoming Ring": "رنين مكالمة واردة",
    "Disable All Notification Sounds": "تعطيل جميع أصوات الإشعارات",
    "Disables all notification sounds, including voice & video sound effects. Your individual sound preferences will be saved and restored if you turn this on.": "يعطل جميع أصوات الإشعارات، بما في ذلك المؤثرات الصوتية للمكالمات الصوتية والمرئية. سيتم حفظ تفضيلاتك واستعادتها عند إعادة التفعيل.",
    "Enable/disable sounds that play when you’re in a call, like Mute, Unmute, Deafen, and more.": "تفعيل/تعطيل الأصوات أثناء المكالمات، مثل كتم الصوت، وإلغاء الكتم، والديفن، والمزيد.",
    "Badges": "شارات التنبيه (Badges)",
    "Enable Unread Message Badge": "تفعيل شارة الرسائل غير المقروءة",
    "Shows a red badge on the app icon when you have unread messages.": "يُظهر شارة حمراء على أيقونة التطبيق عند وجود رسائل غير مقروءة.",
    "Communication Emails": "رسائل التواصل البريدية",
    "Receive emails for missed calls, messages, and message digests.": "استلام رسائل بريد إلكتروني للمكالمات والرسائل الفائتة وملخصات المحادثات.",
    "Social Emails": "رسائل البريد الاجتماعية",
    "Receive emails for friend requests, new friend suggestions, and events in your server.": "استلام رسائل بريد إلكتروني لطلبات الصداقة واقتراحات الأصدقاء الجدد وفعاليات السيرفر.",
    "Announcements and Update Emails": "رسائل الإعلانات والتحديثات",
    "Receive emails about product updates, our newest features, improvements and bug fixes.": "استلام رسائل بريد إلكتروني حول تحديثات التطبيق وأحدث الميزات والتحسينات وإصلاحات الأخطاء.",
    "Tip Emails": "رسائل النصائح والإرشادات",
    "Receive emails with helpful advice on how to use Discord and information on lesser known features.": "استلام رسائل بريد إلكتروني تحتوي على نصائح مفيدة حول استخدام ديسكورد والميزات الخفية.",
    "Recommendations Emails": "رسائل التوصيات والاقتراحات",
    "Receive emails with recommended servers and suggested events.": "استلام رسائل بريد إلكتروني بالسيرفرات الموصى بها والفعاليات المقترحة.",
    "Unsubscribe from all marketing emails": "إلغاء الاشتراك في جميع رسائل التسويق",
    "This includes any emails about product updates, new features, tips on using Discord, and recommendations on new servers, events or stage channels.": "يشمل ذلك أي رسائل بريد إلكتروني حول التحديثات، والميزات الجديدة، والنصائح، وتوصيات السيرفرات والفعاليات.",
    "Unsubscribe": "إلغاء الاشتراك",
    "Advanced": "إعدادات متقدمة",
    "Show Advanced Notification Settings": "إظهار إعدادات الإشعارات المتقدمة",
    "Mobile notification delay, allow playback and usage of /tts command, and more": "تأخير إشعارات الجوال، والسماح بتشغيل أمر /tts، والمزيد"
};

export const regexTranslations: [RegExp, (match: RegExpMatchArray) => string][] = [
    [/^(\d+)\s+accounts?$/i, m => `${m[1]} حساباً`],
    [/^(\d+)\s+devices?$/i, m => `${m[1]} أجهزة`],
    [/^(\d+)\s+members?$/i, m => `${m[1]} أعضاء`],
    [/^(\d+)\s+servers?$/i, m => `${m[1]} سيرفرات`],
    [/^(\d+)\s+mutual\s+servers?$/i, m => `${m[1]} سيرفرات مشتركة`],
    [/^(\d+)\s+mutual\s+friends?$/i, m => `${m[1]} أصدقاء مشتركين`],
    [/^See\s+(\d+)\s+more$/i, m => `عرض ${m[1]} إضافية`],
    [/^Enable\s+(.+)\s+Sound Pack$/i, m => `تفعيل حزمة أصوات ${m[1]}`],
    [/^You're sharing activity with (.+) and (\d+) other servers\.?$/i, m => `أنت تشارك نشاطك مع ${m[1]} و ${m[2]} سيرفرات أخرى.`],
    [/^You’re sharing activity with (.+) and (\d+) other servers\.?$/i, m => `أنت تشارك نشاطك مع ${m[1]} و ${m[2]} سيرفرات أخرى.`],
    [/^Control how your game and app activity is shared.*$/i, () => "تحكم في كيفية مشاركة نشاط ألعابك وتطبيقاتك وما هو مرئي ومن يراه."]
];

export function getTranslationForText(text: string): string | null {
    if (!text || typeof text !== "string") return null;
    const clean = text.trim();
    if (!clean) return null;

    // 1. Exact match in zencord
    if (zencordTranslations[clean]) return zencordTranslations[clean];

    // 2. Exact match in discord settings
    if (discordSettingsTranslations[clean]) return discordSettingsTranslations[clean];

    // 3. Normalized match
    const norm = normalizeText(clean);
    if (zencordTranslations[norm]) return zencordTranslations[norm];
    if (discordSettingsTranslations[norm]) return discordSettingsTranslations[norm];

    // 4. Trailing "Learn more" / "Learn more." match
    if (clean.endsWith("Learn more") || clean.endsWith("Learn more.")) {
        const base = clean.replace(/\.?\s*Learn more\.?$/i, "").trim();
        const baseNorm = normalizeText(base);
        const trans = discordSettingsTranslations[base] || discordSettingsTranslations[baseNorm];
        if (trans) {
            return `${trans} معرفة المزيد`;
        }
    }

    // 5. Regex dynamic rules
    for (const [regex, replacer] of regexTranslations) {
        const m = clean.match(regex) || norm.match(regex);
        if (m) {
            return replacer(m);
        }
    }

    // 6. Comprehensive English phrases (8,770 Discord strings)
    if (englishPhrases[clean]) return englishPhrases[clean];
    if (englishPhrases[norm]) return englishPhrases[norm];
    const lower = clean.toLowerCase();
    if (englishLowerPhrases.has(lower)) return englishLowerPhrases.get(lower)!;

    return null;
}

export const pluginNameTranslations: Record<string, { name: string; desc: string }> = {
    // New ZenCord Additions
    "DetectBlock": {
        name: "كاشف البلوك (Detect Block)",
        desc: "يكتشف المستخدمين الذين حظروك وينبهك فور دخولهم إلى الرومات الصوتية أو المجموعات المشتركة، مع شارة تنبيه وإشعار فوري"
    },
    "detectBlock": {
        name: "كاشف البلوك (Detect Block)",
        desc: "يكتشف المستخدمين الذين حظروك وينبهك فور دخولهم إلى الرومات الصوتية أو المجموعات المشتركة، مع شارة تنبيه وإشعار فوري"
    },
    "Stalker": {
        name: "مراقب النشاط والأعضاء (Stalker)",
        desc: "مراقبة نشاط أعضاء محددين وتتبع أوقات دخولهم للرومات الصوتية وتغيير حالاتهم مع حفظ سجل كامل"
    },
    "stalker": {
        name: "مراقب النشاط والأعضاء (Stalker)",
        desc: "مراقبة نشاط أعضاء محددين وتتبع أوقات دخولهم للرومات الصوتية وتغيير حالاتهم مع حفظ سجل كامل"
    },
    "StreamProof": {
        name: "حماية البث والمشاركة (StreamProof)",
        desc: "إخفاء الرسائل الحساسة والبروفايل والمعلومات السرية تلقائياً وبزر سريع أثناء مشاركة الشاشة أو البث"
    },
    "streamProof": {
        name: "حماية البث والمشاركة (StreamProof)",
        desc: "إخفاء الرسائل الحساسة والبروفايل والمعلومات السرية تلقائياً وبزر سريع أثناء مشاركة الشاشة أو البث"
    },
    "MicPro": {
        name: "مخبر الصوت الاحترافي (MicPro)",
        desc: "تحسين جودة المايك ومعالجة الصوت بتقنيات احترافية وبث ستيريو نقي جداً وعزل فائق للضوضاء"
    },
    "micPro": {
        name: "مخبر الصوت الاحترافي (MicPro)",
        desc: "تحسين جودة المايك ومعالجة الصوت بتقنيات احترافية وبث ستيريو نقي جداً وعزل فائق للضوضاء"
    },
    "AudioLimiter": {
        name: "محدد ومنقي الصوت (Audio Limiter)",
        desc: "تحديد سقف أعلى لارتفاع الصوت لحماية أذنيك من الأصوات العالية والمزعجة والصراخ المفاجئ في الرومات"
    },
    "audioLimiter": {
        name: "محدد ومنقي الصوت (Audio Limiter)",
        desc: "تحديد سقف أعلى لارتفاع الصوت لحماية أذنيك من الأصوات العالية والمزعجة والصراخ المفاجئ في الرومات"
    },
    "VoiceGuard": {
        name: "حارس الروم الصوتي (Voice Guard)",
        desc: "إعادة دخول تلقائي فورية عند الطرد أو النقل من الروم، وتثبيت الروم الصوتي وإلغاء الميوت الإداري"
    },
    "voiceGuard": {
        name: "حارس الروم الصوتي (Voice Guard)",
        desc: "إعادة دخول تلقائي فورية عند الطرد أو النقل من الروم، وتثبيت الروم الصوتي وإلغاء الميوت الإداري"
    },
    "BigFileUploadEnhanced": {
        name: "رافع الملفات الكبيرة (Big File Upload)",
        desc: "رفع ومشاركة الملفات والفيديوهات الضخمة وتخطي حجم ديسكورد الصغير عبر استضافات سريعة ومجانية"
    },
    "bigFileUploadEnhanced": {
        name: "رافع الملفات الكبيرة (Big File Upload)",
        desc: "رفع ومشاركة الملفات والفيديوهات الضخمة وتخطي حجم ديسكورد الصغير عبر استضافات سريعة ومجانية"
    },

    // Top & Core Essentials
    "ArabicUI": {
        name: "الواجهة العربية (Arabic UI)",
        desc: "تعريب واجهة وقوائم وإعدادات زن كورد بالكامل مع أسماء الإضافات وشروحاتها وخط عربي فخم"
    },
    "FakeDeafen": {
        name: "فيك ديفن وميوت وهمي (Fake Deafen)",
        desc: "إظهار علامة الديفن أو الميوت للأعضاء بالروم الصوتي بينما تسمع كل شيء وتتحدث بحرية تامة وبكل سرية"
    },
    "Translate": {
        name: "مترجم الرسائل (Translate)",
        desc: "ترجمة الرسائل لأي لغة بنقرة زر واحدة أو ترجمة ما تكتبه قبل إرساله فوراً"
    },
    "VoiceMessages": {
        name: "الرسائل الصوتية (Voice Messages)",
        desc: "تسجيل وإرسال رسائل صوتية عبر المايك مباشرة من جهاز الكمبيوتر مثل الهاتف"
    },
    "FakeNitro": {
        name: "مميزات نيترو مجانية (Fake Nitro)",
        desc: "إرسال الإيموجيات والستيكرات المتحركة مجاناً ومشاركة الشاشة بأعلى جودة 1080p"
    },
    "ShowHiddenChannels": {
        name: "إظهار الرومات المخفية (Show Hidden Channels)",
        desc: "إظهار القنوات والرومات المقفولة والمخفية في السيرفرات لمعرفة أسمائها وموضوعها"
    },
    "ShowHiddenThings": {
        name: "إظهار العناصر المخفية (Show Hidden Things)",
        desc: "إظهار المرفقات والرسائل والعناصر المخفية التي يتم إخفاؤها في ديسكورد"
    },
    "SilentTyping": {
        name: "الكتابة الصامتة (Silent Typing)",
        desc: "إخفاء مؤشر 'يكتب الآن...' ومنع ديسكورد من إعلام الآخرين أنك تقوم بالكتابة"
    },
    "SilentMessageToggle": {
        name: "زر الرسائل الصامتة (Silent Message Toggle)",
        desc: "إضافة زر في صندوق الشات لإرسال رسائل صامتة بدون تنبيه صوتي للمستلم"
    },
    "ViewRaw": {
        name: "عرض النص الخام (View Raw)",
        desc: "نسخ وعرض النص الحقيقي والماركداون الأصلي لأي رسالة قبل معالجتها"
    },
    "WhoReacted": {
        name: "من تفاعل (Who Reacted)",
        desc: "عرض قائمة سريعة بأسماء وصور الأعضاء الذين تفاعلوا مع أي رسالة بلمسة ماوس"
    },
    "SpotifyControls": {
        name: "التحكم في سبوتيفاي (Spotify Controls)",
        desc: "إضافة مشغل موسيقى للتحكم بأغاني سبوتيفاي وتخطيها وإيقافها من داخل ديسكورد"
    },
    "SpotifyCrack": {
        name: "سبوتيفاي مفتوح المزايا (Spotify Crack)",
        desc: "الاستماع إلى سبوتيفاي دون توقف ودون الحاجة لحساب بريميوم للاستماع المشترك"
    },
    "MessageLogger": {
        name: "سجل الرسائل المحذوفة (Message Logger)",
        desc: "حفظ وتتبع الرسائل المحذوفة والمعدلة وتلوينها لمعرفة ما تم حذفه فوراً"
    },
    "BetterFolders": {
        name: "تحسين مجلدات السيرفرات (Better Folders)",
        desc: "تحسين مظهر وطريقة فتح وإغلاق مجلدات السيرفرات في الشريط الجانبي بأناقة"
    },
    "BetterSettings": {
        name: "تحسين صفحة الإعدادات (Better Settings)",
        desc: "تنظيم وتسهيل التنقل داخل إعدادات ديسكورد وزيادة سرعة الوصول للأقسام"
    },
    "BetterRoleDot": {
        name: "ألوان الرتب الدائرية (Better Role Dot)",
        desc: "تحسين شكل نقاط ألوان الرتب لتكون أكثر وضوحاً وأناقة بجانب الأسماء"
    },
    "ClearURLs": {
        name: "تنظيف الروابط من التتبع (Clear URLs)",
        desc: "حذف معلمات التتبع والتجسس من الروابط قبل مشاركتها لزيادة خصوصيتك"
    },
    "CopyEmojiMarkdown": {
        name: "نسخ كود الإيموجي (Copy Emoji Markdown)",
        desc: "نسخ إيموجيات السيرفرات ككود ماركداون لنقلها واستخدامها بسهولة"
    },
    "CopyUserURLs": {
        name: "نسخ رابط البروفايل (Copy User URLs)",
        desc: "إضافة خيار في القائمة لنسخ رابط حساب أي مستخدم بنقرة واحدة"
    },
    "Decor": {
        name: "زينة وصور الأفاتار (Decor)",
        desc: "دعم أشكال وزينة الأفاتار المخصصة بحرية وبدون تكلفة"
    },
    "Experiments": {
        name: "الميزات التجريبية (Experiments)",
        desc: "تفعيل تبويب المطورين (Experiments) لتجربة ميزات ديسكورد القادمة قبل إطلاقها"
    },
    "ImageZoom": {
        name: "تكبير الصور (Image Zoom)",
        desc: "إمكانية تكبير وتصغير أي صورة داخل الشات باستخدام بكرة الماوس بسهولة تامة"
    },
    "OpenInApp": {
        name: "الفتح في التطبيقات (Open In App)",
        desc: "فتح روابط سبوتيفاي وتويتر ويوتيوب في برامجها الرسمية بدلاً من المتصفح"
    },
    "PinDms": {
        name: "تثبيت المحادثات الخاصة (Pin DMs)",
        desc: "تثبيت المحادثات المباشرة (DMs) المهمة في أعلى القائمة للوصول السريع إليها"
    },
    "PlatformIndicators": {
        name: "أيقونة جهاز المستخدم (Platform Indicators)",
        desc: "إظهار علامة بجانب حالة المستخدم تبين إن كان متصلاً من الكمبيوتر أو الهاتف أو الويب"
    },
    "QuickMention": {
        name: "منشن سريع (Quick Mention)",
        desc: "عمل منشن للمستخدم بسرعة بمجرد النقر على اسمه أو صورته"
    },
    "ReviewDB": {
        name: "تقييمات المستخدمين (ReviewDB)",
        desc: "قراءة وكتابة مراجعات وتقييمات في بروفايلات المستخدمين في ديسكورد"
    },
    "ServerInfo": {
        name: "معلومات السيرفر الشاملة (Server Info)",
        desc: "عرض بطاقة شاملة بكافة تفاصيل وإحصائيات وأدوار السيرفر بنقرة زر"
    },
    "TypingIndicator": {
        name: "مؤشر كتابة متطور (Typing Indicator)",
        desc: "إظهار صور وأفاتار الأعضاء الذين يكتبون حالياً في زاوية الشات"
    },
    "VolumeBooster": {
        name: "مضخم ومقوي الصوت (Volume Booster)",
        desc: "رفع صوت أي شخص أو بث في المحادثة الصوتية حتى 500% لتوضيح وتضخيم الأصوات الضعيفة"
    },
    "YoutubeAdblock": {
        name: "مانع إعلانات يوتيوب (YouTube Adblock)",
        desc: "حظر الإعلانات داخل مقاطع فيديو يوتيوب المضمنة في شات ديسكورد"
    },
    "NoTrack": {
        name: "منع التتبع والتحليلات (No Track)",
        desc: "إيقاف إرسال بيانات الاستخدام وسجلات الأخطاء إلى خوادم ديسكورد لحماية خصوصيتك"
    },
    "ThemeAttributes": {
        name: "خصائص الثيمات المتقدمة (Theme Attributes)",
        desc: "توفير معلومات إضافية لثيمات CSS لتخصيص كل زاوية في التطبيق بدقة"
    },
    "CrashHandler": {
        name: "حماية ومعالج الانهيارات (Crash Handler)",
        desc: "حماية التطبيق من الإغلاق المفاجئ وعرض سبب الخطأ بأمان وسلاسة"
    },
    "AlwaysAnimate": {
        name: "تحريك دائم للإيموجيات (Always Animate)",
        desc: "جعل جميع الإيموجيات والستيكرات والأفاتار المتحركة تعمل باستمرار دون توقف"
    },
    "BiggerStreamPreview": {
        name: "تكبير معاينة البث (Bigger Stream Preview)",
        desc: "عرض صورة معاينة شاشة البث المباشر بحجم كبير وواضح عند تمرير الماوس"
    },
    "BlurNSFW": {
        name: "تعتيم المحتوى الحساس (Blur NSFW)",
        desc: "تعتيم صور المحتوى الحساس أو الصريح حتى تضغط عليها لحمايتك"
    },
    "CallTimer": {
        name: "مؤقت المكالمات (Call Timer)",
        desc: "عرض مدة المكالمة الصوتية بالساعة والدقيقة والثانية بدقة في الشاشة"
    },
    "CharacterCounter": {
        name: "عداد الحروف (Character Counter)",
        desc: "عرض عدد الحروف المتبقية المسموح بها في الرسالة أثناء الكتابة"
    },
    "CustomIdle": {
        name: "تخصيص وقت الخمول (Custom Idle)",
        desc: "تحديد وقت خمول حسابك قبل تحويل حالتك إلى خامل (Idle)"
    },
    "CustomRPC": {
        name: "حالة نشاط مخصصة (Custom Rich Presence)",
        desc: "تخصيص النشاط الذي يظهر تحت اسمك في بروفايلك بحرية كاملة مع صور وأزرار تفاعلية"
    },
    "Dearrow": {
        name: "إزالة عناوين كليك بيت (DeArrow)",
        desc: "استبدال صور وعناوين فيديوهات يوتيوب المضللة بعناوين وصور حقيقية ومفيدة"
    },
    "DisableCallIdle": {
        name: "منع الخروج من المكالمات (Disable Call Idle)",
        desc: "منع ديسكورد من طردك من الروم الصوتي عند البقاء بمفردك لفترة طويلة"
    },
    "DontRoundMyTimestamps": {
        name: "أوقات الرسائل الدقيقة (Exact Timestamps)",
        desc: "عرض التوقيت الدقيق للرسائل بالساعة والدقيقة والتاريخ بدلاً من 'منذ 5 دقائق'"
    },
    "FixImagesQuality": {
        name: "تحسين جودة الصور الأصلية (Fix Images Quality)",
        desc: "إجبار ديسكورد على تحميل الصور بأعلى جودة أصلية ممكنة دون ضغط جودتها"
    },
    "FixSpotifyEmbeds": {
        name: "إصلاح تضمين سبوتيفاي (Fix Spotify Embeds)",
        desc: "إصلاح مشاكل تشغيل مقاطع سبوتيفاي المضمنة في الشات"
    },
    "FixYoutubeEmbeds": {
        name: "إصلاح تضمين يوتيوب (Fix YouTube Embeds)",
        desc: "تحسين تشغيل فيديوهات يوتيوب المضمنة داخل الشات"
    },
    "FriendInvites": {
        name: "روابط طلبات الصداقة (Friend Invites)",
        desc: "إنشاء رابط دعوة خاص بك لمشاركته مع الآخرين لإضافتك كصديق مباشرة"
    },
    "FullSearchContext": {
        name: "سياق البحث الكامل (Full Search Context)",
        desc: "عرض الرسائل المحيطة بنتائج البحث لفهم سياق المحادثة بشكل أفضل"
    },
    "GameActivityToggle": {
        name: "زر تشغيل/إيقاف نشاط الألعاب (Game Activity Toggle)",
        desc: "إضافة زر سريع في شريط الحالة لتشغيل أو إيقاف مشاركة اللعبة التي تلعبها حالياً"
    },
    "HideAttachments": {
        name: "إخفاء المرفقات (Hide Attachments)",
        desc: "إمكانية إخفاء المرفقات الكبيرة أو المزعجة في الشات بضغطة زر"
    },
    "IgnoreActivities": {
        name: "تجاهل أنشطة معينة (Ignore Activities)",
        desc: "إخفاء أنشطة ألعاب محددة لا ترغب في رؤيتها من قائمة الأصدقاء"
    },
    "ImageLink": {
        name: "رابط مباشر للصور (Image Link)",
        desc: "إضافة زر مباشر لفتح أو نسخ الرابط الأصلي لأي صورة في الشات"
    },
    "MemberCount": {
        name: "عداد أعضاء السيرفر (Member Count)",
        desc: "عرض إجمالي عدد الأعضاء والمتصلين في أعلى قائمة السيرفر"
    },
    "MessageClickActions": {
        name: "إجراءات النقر على الرسائل (Message Click Actions)",
        desc: "تخصيص وظيفة النقر المزدوج على الرسائل مثل الرد السريع أو التعديل الفوري"
    },
    "MessageLatency": {
        name: "قياس تأخير الرسائل (Message Latency)",
        desc: "عرض زمن وتأخير وصول الرسائل بالملي ثانية (Ping)"
    },
    "MoreQuickReactions": {
        name: "تفاعلات سريعة إضافية (More Quick Reactions)",
        desc: "زيادة عدد الإيموجيات السريعة التي تظهر في شريط الرسالة"
    },
    "NoBlockedMessages": {
        name: "إخفاء الرسائل المحظورة تماماً (No Blocked Messages)",
        desc: "حذف رسائل '1 رسالة محظورة' بالكامل من الشات لعدم رؤيتها نهائياً"
    },
    "NoDevtoolsWarning": {
        name: "إلغاء تحذير أدوات المطور (No Devtools Warning)",
        desc: "إلغاء تحذير 'HOLD UP' عند فتح الكونسول في ديسكورد"
    },
    "NoF1": {
        name: "تعطيل زر F1 (No F1)",
        desc: "منع فتح موقع مساعدة ديسكورد بالخطأ عند الضغط على زر F1"
    },
    "NoMosaic": {
        name: "عرض الصور القديم (No Mosaic)",
        desc: "إلغاء شبكة دمج الصور وعرض كل صورة منفصلة كما كان قديماً"
    },
    "NoPendingCount": {
        name: "إخفاء عداد طلبات الصداقة (No Pending Count)",
        desc: "إخفاء رقم طلبات الصداقة المعلقة من الشريط الجانبي"
    },
    "NoProfileThemes": {
        name: "إلغاء ثيمات البروفايل (No Profile Themes)",
        desc: "تعطيل ألوان وخلفيات البروفايلات المبهرجة والعودة للمظهر البسيط"
    },
    "NoReplyMention": {
        name: "إلغاء منشن الرد الافتراضي (No Reply Mention)",
        desc: "جعل خيار المنشن عند الرد على رسالة غير مفعل تلقائياً لتجنب إزعاج الآخرين"
    },
    "PermissionsViewer": {
        name: "مستعرض الصلاحيات (Permissions Viewer)",
        desc: "معرفة وعرض الصلاحيات الكاملة لأي عضو أو رول في السيرفر بسهولة"
    },
    "PetPet": {
        name: "صناعة ميم التهدئة (PetPet)",
        desc: "صناعة ميم اليد التي تطبطب على صورة بروفايل أي شخص بنقرة واحدة"
    },
    "PictureInPicture": {
        name: "صورة داخل صورة للبث (Picture In Picture)",
        desc: "مشاهدة بثوث الأصدقاء أو الكاميرا في نافذة عائمة فوق البرامج الأخرى"
    },
    "PreviewMessage": {
        name: "معاينة الرسالة قبل الإرسال (Preview Message)",
        desc: "مشاهدة كيف ستبدو رسالتك وتنسيقها وماركداونها قبل إرسالها للجميع"
    },
    "QuickReply": {
        name: "رد سريع (Quick Reply)",
        desc: "الرد على أي رسالة بسرعة بضغطة زر دون الحاجة لفتح القائمة"
    },
    "ReadAllNotificationsButton": {
        name: "زر قراءة كل الإشعارات (Read All Notifications)",
        desc: "إضافة زر في أعلى قائمة السيرفرات لتعليم كل الرسائل غير المقروءة كمقروءة دفعة واحدة"
    },
    "RelationshipNotifier": {
        name: "منبه العلاقات والأصدقاء (Relationship Notifier)",
        desc: "إرسال إشعار فوري لك عندما يقوم شخص بإزالتك من قائمة الأصدقاء أو حظرك"
    },
    "RevealAllSpoilers": {
        name: "كشف الرسائل المشفرة (Reveal All Spoilers)",
        desc: "إظهار وكشف جميع نصوص وصور السبويلر تلقائياً دون الحاجة للنقر عليها"
    },
    "ReverseImageSearch": {
        name: "البحث العكسي عن الصور (Reverse Image Search)",
        desc: "البحث عن مصدر أي صورة في الشات عبر Google أو Yandex أو SauceNAO"
    },
    "RoleColorEverywhere": {
        name: "ألوان الرتب في كل مكان (Role Color Everywhere)",
        desc: "تطبيق لون رتبة العضو على رسائله ومنشن اسمه في كل مكان في ديسكورد"
    },
    "SendTimestamps": {
        name: "أداة التوقيت الديناميكي (Send Timestamps)",
        desc: "تسهيل إنشاء وإرسال التوقيتات الديناميكية التي تتكيف مع المنطقة الزمنية لكل شخص"
    },
    "ShowAllMessageButtons": {
        name: "إظهار جميع أزرار الرسالة (Show All Message Buttons)",
        desc: "إظهار أزرار التفاعل والرد والتعديل دائماً بجانب الرسائل دون الحاجة لتمرير الماوس"
    },
    "ShowConnections": {
        name: "عرض الحسابات المربوطة (Show Connections)",
        desc: "عرض روابط وحسابات المستخدم المتصلة (يوتيوب، تويتش، ستيم، إلخ) مباشرة في البطاقة"
    },
    "ShowMeYourName": {
        name: "إظهار الاسم الحقيقي (Show Me Your Name)",
        desc: "عرض اسم المستخدم الأصلي (Username) بجانب لقبه في السيرفر لمعرفة من هو دائماً"
    },
    "ShowTimeoutDuration": {
        name: "مدة الكتم المتبقية (Show Timeout Duration)",
        desc: "إظهار المدة المتبقية لرفع الكتم (Timeout) عن العضو في السيرفر"
    },
    "SuperReactionTweaks": {
        name: "تحسين التفاعلات الخارقة (Super Reaction Tweaks)",
        desc: "تعديل ومنع التأثيرات المزعجة للتفاعلات الفائقة (Super Reactions)"
    },
    "TextReplace": {
        name: "الاستبدال التلقائي للنصوص (Text Replace)",
        desc: "استبدال اختصارات الكلمات تلقائياً بجمل كاملة أثناء الكتابة"
    },
    "UserVoiceShow": {
        name: "إظهار الروم الصوتي للعضو (User Voice Show)",
        desc: "إظهار اسم الروم الصوتي المتواجد به أي صديق بجانب اسمه في قائمة الأصدقاء"
    },
    "ValidUser": {
        name: "التحقق من الحسابات (Valid User)",
        desc: "توضيح إن كان الحساب حقيقياً أو محذوفاً أو وهمياً بدقة"
    },
    "ViewIcons": {
        name: "عرض وتحميل الأيقونات (View Icons)",
        desc: "إمكانية فتح وتحميل صور بروفايلات وأيقونات وإيموجيات السيرفرات بحجمها الكامل"
    },
    "VoiceDownload": {
        name: "تحميل التسجيلات الصوتية (Voice Download)",
        desc: "إضافة زر مباشر لتحميل أي رسالة صوتية مرسلة في الشات كملف صوتي بجهازك"
    }
,
    "BadgeAPI": {
        name: "واجهة الشارات البرمجية (Badge API)",
        desc: "عرض وإدارة شارات المساهمين والمطورين في زن كورد"
    },
    "ChatInputButtonAPI": {
        name: "أزرار شريط الشات البرمجية (Chat Input Button API)",
        desc: "واجهة برمجية لإضافة أزرار مخصصة لشريط الكتابة"
    },
    "CommandsAPI": {
        name: "واجهة الأوامر البرمجية (Commands API)",
        desc: "واجهة تشغيل وتسجيل أوامر السلاش المخصصة (/commands)"
    },
    "ContextMenuAPI": {
        name: "واجهة قوائم السياق (Context Menu API)",
        desc: "واجهة إضافة وتعديل عناصر قوائم الماوس الأيمن"
    },
    "DynamicImageModalAPI": {
        name: "واجهة نوافذ الصور التفاعلية (Dynamic Image Modal API)",
        desc: "تحسين فتح الصور بنوافذ منبثقة تفاعلية متناسقة"
    },
    "MemberListDecoratorsAPI": {
        name: "واجهة زخرفة قائمة الأعضاء (Member List Decorators API)",
        desc: "إضافة علامات وزينة مخصصة بجانب أسماء الأعضاء في القائمة"
    },
    "MessageAccessoriesAPI": {
        name: "واجهة ملحقات الرسائل (Message Accessories API)",
        desc: "إضافة ملحقات وتفاصيل إضافية أسفل الرسائل"
    },
    "MessageDecorationsAPI": {
        name: "واجهة زخرفة الرسائل (Message Decorations API)",
        desc: "تطبيق تأثيرات وزخارف بصرية على الرسائل"
    },
    "MessageEventsAPI": {
        name: "واجهة أحداث الرسائل (Message Events API)",
        desc: "واجهة اعتراض وتعديل الرسائل قبل الإرسال أو بعد الاستقبال"
    },
    "MessagePopoverAPI": {
        name: "واجهة شريط أزرار الرسالة (Message Popover API)",
        desc: "إضافة أزرار سريعة تظهر فوق الرسائل عند تمرير الماوس"
    },
    "MessageUpdaterAPI": {
        name: "واجهة تحديث الرسائل (Message Updater API)",
        desc: "إعادة تحميل وتحديث عرض الرسائل فوراً في الشات"
    },
    "NoticesAPI": {
        name: "واجهة إشعارات النظام (Notices API)",
        desc: "تنظيم وعرض إشعارات وتنبيهات زن كورد في أعلى الشاشة"
    },
    "ServerListAPI": {
        name: "واجهة قائمة السيرفرات (Server List API)",
        desc: "واجهة برمجية للتحكم وتخصيص شريط السيرفرات الجانبي"
    },
    "UserSettingsAPI": {
        name: "واجهة إعدادات المستخدم (User Settings API)",
        desc: "واجهة ربط وتنسيق أقسام إعدادات المستخدم"
    },
    "ConcatenatedComponentExtractor": {
        name: "مستخرج مكونات النظام (Component Extractor)",
        desc: "أداة داخلية لاستخراج مكونات واجهة ديسكورد بسلاسة"
    },
    "FixDiscordCss": {
        name: "إصلاح لاغ الـ CSS (Fix Discord CSS)",
        desc: "إصلاح تهنيج وتأخير استجابة أنماط CSS في ديسكورد وتسريع الواجهة"
    },
    "SupportHelper": {
        name: "مساعد الدعم الفني (Support Helper)",
        desc: "المساعدة في استكشاف الأخطاء وتقديم الدعم الفني لمستخدمي زن كورد"
    },
    "AccountPanelServerProfile": {
        name: "بروفايل السيرفر السريع (Account Panel Server Profile)",
        desc: "فتح بروفايلك في السيرفر الحالي مباشرة عند النقر على بطاقة حسابك باليسار"
    },
    "AddAttachments": {
        name: "إضافة مرفقات أثناء التعديل (Add Attachments)",
        desc: "إمكانية إضافة ملفات وصور جديدة عند تعديل رسالة أرسلتها سابقاً"
    },
    "AlwaysExpandRoles": {
        name: "توسيع الرتب دائماً (Always Expand Roles)",
        desc: "إظهار كافة رتب العضو كاملة في بطاقة البروفايل دون الحاجة لضغط زر المزيد"
    },
    "AlwaysTrust": {
        name: "الوثوق الدائم بالروابط (Always Trust)",
        desc: "إلغاء نافذة التحذير المزعجة 'أنت تغادر ديسكورد' عند فتح أي رابط خارجي"
    },
    "AnonymiseFileNames": {
        name: "تعمية أسماء الملفات (Anonymise File Names)",
        desc: "تغيير أسماء الملفات المرفوعة إلى أسماء عشوائية لحماية خصوصيتك"
    },
    "WebRichPresence (arRPC)": {
        name: "نشاط الألعاب لنسخة الويب (Web Rich Presence)",
        desc: "تفعيل ميزة إظهار اللعبة ونشاط الحساب لنسخة المتصفح ديسكورد ويب عبر arRPC"
    },
    "AutoDNDWhilePlaying": {
        name: "عدم إزعاج تلقائي أثناء اللعب (Auto DND While Playing)",
        desc: "تحويل حالتك تلقائياً إلى 'ممنوع الإزعاج' بمجرد تشغيل أي لعبة والعودة عند إغلاقها"
    },
    "BetterGifAltText": {
        name: "وصف صور الـ GIF الذكي (Better GIF Alt Text)",
        desc: "استبدال كلمة GIF العامة بوصف حقيقي واسم الصورة لتسهيل البحث عنها"
    },
    "BetterGifPicker": {
        name: "منتقي GIF المحسن (Better GIF Picker)",
        desc: "فتح قسم الصور المفضلة تلقائياً عند فتح قائمة الـ GIF"
    },
    "BetterRoleContext": {
        name: "قائمة سياق الرتب (Better Role Context)",
        desc: "إضافة خيارات نسخ وعرض وتحميل أيقونات الرتب بجودة عالية من قائمة الزر الأيمن"
    },
    "BetterSessions": {
        name: "مراقب الجلسات والأجهزة (Better Sessions)",
        desc: "فحص الجلسات في الخلفية وتنبيهك فوراً إذا تم تسجيل الدخول لحسابك من جهاز جديد"
    },
    "BetterUploadButton": {
        name: "زر رفع ملفات سريع (Better Upload Button)",
        desc: "فتح نافذة اختيار الملفات بضغطة واحدة، وفتح القائمة بالزر الأيمن"
    },
    "ClientTheme": {
        name: "لون ثيم زن كورد (Client Theme)",
        desc: "تخصيص لون خلفية وواجهة ديسكورد واختيار أي لون تريده بسهولة"
    },
    "ColorSighted": {
        name: "حالات ديسكورد الكلاسيكية (Color Sighted)",
        desc: "العودة لشكل دوائر الحالة الكلاسيكية الملونة بدون أيقونات عمى الألوان مثل 2016"
    },
    "ConsoleJanitor": {
        name: "تنظيف سجلات الكونسول (Console Janitor)",
        desc: "تعطيل رسائل وسجلات ديسكورد المزعجة في كونسول المتصفح لتسريع الأداء"
    },
    "ConsoleShortcuts": {
        name: "اختصارات الكونسول البرمجية (Console Shortcuts)",
        desc: "إضافة أوامر واختصارات سريعة للمطورين داخل كونسول التطبيق"
    },
    "CopyFileContents": {
        name: "نسخ محتوى الملفات (Copy File Contents)",
        desc: "إضافة زر مباشر لنسخ النصوص البرمجية والملفات النصية المرفقة دون تحميلها"
    },
    "CopyStickerLinks": {
        name: "نسخ روابط الستيكرات (Copy Sticker Links)",
        desc: "إضافة خيار لنسخ وفتح رابط أي ستيكر في الشات مباشرة"
    },
    "CustomCommands": {
        name: "الأوامر المخصصة (Custom Commands)",
        desc: "إنشاء أوامر واختصارات سلاش مخصصة لك ترسل نصوص وردود جاهزة تلقائياً"
    },
    "DevCompanion": {
        name: "رفيق المطور (Dev Companion)",
        desc: "أداة تطوير وتحديث كود الإضافات ومزامنتها على الهواء مباشرة"
    },
    "DirectFileDownload": {
        name: "التحميل المباشر للملفات (Direct File Download)",
        desc: "تحميل الملفات والمرفقات مباشرة إلى جهازك فور الضغط عليها دون فتح المتصفح"
    },
    "ExpressionCloner": {
        name: "ناسخ الإيموجيات والستيكرات (Expression Cloner)",
        desc: "نسخ واستنساخ أي إيموجي أو ستيكر يعجبك إلى سيرفرك الخاص بضغطة زر يمين"
    },
    "F8Break": {
        name: "إيقاف المطور المؤقت بـ F8 (F8 Break)",
        desc: "إيقاف الواجهة مؤقتاً لتفحص الأكواد عند الضغط على زر F8 وأدوات المطور مفتوحة"
    },
    "FakeProfileThemes": {
        name: "ثيمات البروفايل المجانية (Fake Profile Themes)",
        desc: "تفعيل واختيار ألوان لبروفايلك وتخصيص مظهره دون الحاجة لاشتراك نيترو"
    },
    "FavoriteEmojiFirst": {
        name: "المفضلة أولاً في الإيموجي (Favorite Emoji First)",
        desc: "وضع الإيموجيات المفضلة في أعلى قائمة الإكمال التلقائي لسرعة الاختيار"
    },
    "FixCodeblockGap": {
        name: "إصلاح فراغ كتل الأكواد (Fix Codeblock Gap)",
        desc: "إزالة المسافة البيضاء غير المرغوبة بين مربعات الأكواد والنص التابع لها"
    },
    "ForceOwnerCrown": {
        name: "تاج مالك السيرفر الدائم (Force Owner Crown)",
        desc: "إظهار تاج التاج الذهبي بجانب اسم مالك السيرفر دائماً حتى في السيرفرات الضخمة"
    },
    "FullUserInChatbox": {
        name: "منشن متفاعل في الشات (Full User In Chatbox)",
        desc: "جعل منشن الأعضاء في صندوق الكتابة قابلاً للنقر لفتح بروفايلهم وقائمة الخيارات"
    },
    "GifPaste": {
        name: "لصق رابط الـ GIF (GIF Paste)",
        desc: "وضع رابط صورة الـ GIF في صندوق الكتابة لمراجعته قبل إرساله بدلاً من الإرسال الفوري"
    },
    "GifProviderSwitcher": {
        name: "تبديل مزود الـ GIF (GIF Provider Switcher)",
        desc: "التبديل بين محركات البحث عن صور الـ GIF (Tenor / Giphy) بحرية"
    },
    "GreetStickerPicker": {
        name: "منتقي ستيكرات الترحيب (Greet Sticker Picker)",
        desc: "تخصيص نمط واختيار ستيكرات الترحيب بالأعضاء الجدد في السيرفر"
    },
    "HideMedia": {
        name: "إخفاء الوسائط المنفردة (Hide Media)",
        desc: "إضافة زر عائم فوق كل رسالة لإخفاء صورها ومرفقاتها ومقاطعها بشكل فردي"
    },
    "iLoveSpam": {
        name: "إلغاء حجب السبام (I Love Spam)",
        desc: "منع ديسكورد من إخفاء الرسائل التي يعتقد أنها رسائل مزعجة أو سبام"
    },
    "ImageFilename": {
        name: "عرض اسم ورابط الصورة (Image Filename)",
        desc: "إظهار اسم الملف والرابط الحقيقي للصورة أسفلها في الشات"
    },
    "ImplicitRelationships": {
        name: "كشف العلاقات الخفية (Implicit Relationships)",
        desc: "ترتيب وعرض الحسابات المتصلة بك وعلاقاتك الخفية بناءً على نسبة التقارب"
    },
    "IrcColors": {
        name: "ألوان شات IRC المميزة (IRC Colors)",
        desc: "تلوين أسماء المستخدمين في الشات بألوان عشوائية مميزة مثل غرف دردشة IRC الكلاسيكية"
    },
    "JumpToTop": {
        name: "القفز لأول رسالة (Jump To Top)",
        desc: "إضافة زر سريع للانتقال لأول رسالة في أي روم أو شات بضغطة واحدة"
    },
    "KeepCurrentChannel": {
        name: "تذكر الروم الحالي (Keep Current Channel)",
        desc: "إبقاء الروم الحالي مفتوحاً عند تبديل الحسابات أو إعادة تشغيل ديسكورد"
    },
    "LoadingQuotes": {
        name: "اقتباسات شاشة التحميل (Loading Quotes)",
        desc: "تخصيص النصوص الطريفة والاقتباسات التي تظهر أثناء شاشة بدء تشغيل ديسكورد"
    },
    "MentionAvatars": {
        name: "صورة العضو في المنشن (Mention Avatars)",
        desc: "إظهار صورة البروفايل المصغرة بجانب اسم الشخص داخل المنشن (@Name)"
    },
    "MessageLinkEmbeds": {
        name: "معاينة روابط الرسائل (Message Link Embeds)",
        desc: "عرض محتوى وتفاصيل الرسالة المقتبسة عند مشاركة رابط رسالة في الشات"
    },
    "MusicRichPresence": {
        name: "حالة تشغيل الموسيقى (Music Rich Presence)",
        desc: "عرض تفاصيل الأغاني والفنان من خدمات الموسيقى المتعددة في بروفايلك"
    },
    "MutualGroupDMs": {
        name: "المجموعات المشتركة (Mutual Group DMs)",
        desc: "إظهار المجموعات الخاصة المشتركة بينك وبين أي شخص داخل بطاقة بروفايله"
    },
    "NewGuildSettings": {
        name: "إعدادات السيرفرات الجديدة (New Guild Settings)",
        desc: "كتم التنبيهات وضبط إشعارات أي سيرفر جديد تدخله تلقائياً"
    },
    "DisableDeepLinks": {
        name: "تعطيل تحويل الروابط للبرنامج (Disable Deep Links)",
        desc: "منع ديسكورد ويب من محاولة إجبارك على فتح تطبيق سطح المكتب عند الضغط على الروابط"
    },
    "NoMaskedUrlPaste": {
        name: "منع الروابط المموهة (No Masked URL Paste)",
        desc: "لصق الروابط كنصوص عادية لمنع الخداع بالروابط المشبوهة أو المخفية"
    },
    "NoMiddleClickPaste": {
        name: "منع اللصق بالزر الأوسط (No Middle Click Paste)",
        desc: "تعطيل اللصق التلقائي للنصوص عند الضغط على بكرة الماوس (خاص بـ Linux)"
    },
    "NoOnboardingDelay": {
        name: "تخطي تهيئة السيرفرات (No Onboarding Delay)",
        desc: "تخطي شاشات الأسئلة الترحيبية والانتظار البطيء عند الانضمام لسيرفرات جديدة"
    },
    "NoServerEmojis": {
        name: "منع إيموجيات السيرفرات المزعجة (No Server Emojis)",
        desc: "تصفية إيموجيات معينة من قائمة الإكمال التلقائي أثناء الكتابة"
    },
    "NoSystemBadge": {
        name: "إخفاء رقم الرسائل بشريط المهام (No System Badge)",
        desc: "إخفاء شارة عدد الرسائل غير المقروءة من أيقونة ديسكورد في شريط المهام"
    },
    "NotificationVolume": {
        name: "مستوى صوت الإشعارات (Notification Volume)",
        desc: "التحكم في درجة علو أو خفض صوت إشعارات وتنبيهات ديسكورد"
    },
    "NoTypingAnimation": {
        name: "إيقاف حركة مؤشر الكتابة (No Typing Animation)",
        desc: "تعطيل حركة النقاط الثلاث المتحركة أثناء كتابة الآخرين لتوفير استهلاك المعالج"
    },
    "NoUnblockToJump": {
        name: "القفز لرسائل المحظورين (No Unblock To Jump)",
        desc: "إمكانية الانتقال لمكان رسائل الأشخاص المحظورين دون الحاجة لإلغاء حظرهم"
    },
    "oneko": {
        name: "قطة الشاشة الكيوت (Oneko)",
        desc: "قطة كرتونية لطيفة تركض خلف مؤشر الماوس على الشاشة أثناء استخدام ديسكورد"
    },
    "OnePingPerDM": {
        name: "تنبيه صوتي واحد للخاص (One Ping Per DM)",
        desc: "إطلاق صوت تنبيه واحد فقط لكل محادثة خاصة لتجنب إزعاج الرسائل المتتالية"
    },
    "OverrideForumDefaults": {
        name: "تخصيص قنوات المنتديات (Override Forum Defaults)",
        desc: "اختيار طريقة العرض الافتراضية لقنوات المنتديات (قائمة أو شبكة) بحرية"
    },
    "PauseInvitesForever": {
        name: "إيقاف الدعوات بشكل دائم (Pause Invites Forever)",
        desc: "إعادة خيار إيقاف دعوات السيرفر لفترة غير محددة الذي حذفته ديسكورد"
    },
    "PermissionFreeWill": {
        name: "تجاوز تحذيرات الصلاحيات (Permission Free Will)",
        desc: "تخطي رسالة التحذير المزعجة 'هل أنت متأكد؟' عند تعديل صلاحيات السيرفر"
    },
    "petpet": {
        name: "صناعة ميم الطبطبة (PetPet)",
        desc: "أمر سلاش /petpet لصناعة صورة GIF تطبطب على أي صورة أو أفاتار تختاره"
    },
    "PinDMs": {
        name: "تثبيت المحادثات الخاصة (Pin DMs)",
        desc: "تثبيت المحادثات الخاصة الهامة في أعلى القائمة لتسهيل الوصول إليها"
    },
    "PlainFolderIcon": {
        name: "أيقونة مجلدات نظيفة (Plain Folder Icon)",
        desc: "إخفاء الأيقونات المصغرة من مجلدات السيرفرات لجعل مظهرها بسيطاً ونظيفاً"
    },
    "ReactErrorDecoder": {
        name: "مترجم أخطاء React (React Error Decoder)",
        desc: "تحويل رموز أخطاء React المبهمة إلى تفاصيل واضحة قابلة للقراءة والحل"
    },
    "ReplaceGoogleSearch": {
        name: "تغيير محرك بحث التحديد (Replace Google Search)",
        desc: "استبدال بحث جوجل عند تحديد نص بمحرك بحثك المفضل مثل DuckDuckGo أو غيره"
    },
    "ReplyTimestamp": {
        name: "توقيت الرسالة المردود عليها (Reply Timestamp)",
        desc: "إظهار الوقت والتاريخ الدقيق للرسالة الأصلية في معاينة الردود"
    },
    "SecretRingToneEnabler": {
        name: "نغمة الاتصال النادرة (Secret Ringtone Enabler)",
        desc: "تفعيل نغمة رنين ديسكورد السرية النادرة لتشتغل في كل المكالمات"
    },
    "ServerListIndicators": {
        name: "مؤشرات قنوات السيرفر (Server List Indicators)",
        desc: "إظهار علامات ملونة على أيقونات السيرفرات توضح وجود رسائل أو منشن غير مقروء"
    },
    "ShikiCodeblocks": {
        name: "تلوين الأكواد الفخم (Shiki Codeblocks)",
        desc: "تلوين وتنسيق كتل الأكواد البرمجية بدقة مثل محرر VS Code باستخدام محرك Shiki"
    },
    "SortFriendRequests": {
        name: "ترتيب طلبات الصداقة (Sort Friend Requests)",
        desc: "ترتيب وعرض تاريخ ووقت وصول طلبات الصداقة لمعرفة الأقدم والأحدث"
    },
    "SpotifyShareCommands": {
        name: "مشاركة أغنية سبوتيفاي (Spotify Share Commands)",
        desc: "أمر سريع في الشات لمشاركة الأغنية أو الألبوم أو الفنان الذي تستمع له حالياً"
    },
    "StartupTimings": {
        name: "إحصائيات سرعة التشغيل (Startup Timings)",
        desc: "عرض تفاصيل زمن إقلاع وتحميل كل إضافة في ديسكورد لتحديد ما يبطئ البرنامج"
    },
    "StickerPaste": {
        name: "لصق الستيكرات للشات (Sticker Paste)",
        desc: "إدراج الستيكر داخل صندوق الكتابة أولاً للتأكد منه قبل إرساله فوراً"
    },
    "StreamerModeOnStream": {
        name: "وضع البث التلقائي (Streamer Mode On Stream)",
        desc: "تفعيل وضع الستريمر لحماية بياناتك تلقائياً بمجرد بدء البث المباشر في ديسكورد"
    },
    "TypingTweaks": {
        name: "تحسينات شريط الكتابة (Typing Tweaks)",
        desc: "عرض صور وأفاتار الأعضاء في شريط 'يكتب الآن...' مع إمكانية تخصيص مظهره"
    },
    "Unindent": {
        name: "إزالة المسافات الزائدة (Unindent)",
        desc: "إزالة المسافات البادئة الفارغة تلقائياً عند نسخ أو إرسال كتل الأكواد البرمجية"
    },
    "UnlockedAvatarZoom": {
        name: "تكبير صور الأفاتار الكامل (Unlocked Avatar Zoom)",
        desc: "تكبير وتفحص صور الأفاتار والبانرات لأقصى حد بنقاء تام"
    },
    "UnsuppressEmbeds": {
        name: "إلغاء إخفاء التضمينات (Unsuppress Embeds)",
        desc: "إعادة إظهار معاينة الروابط والوسائط في الرسائل بعد إخفائها"
    },
    "UserMessagesPronouns": {
        name: "عرض ضمائر المستخدمين (User Messages Pronouns)",
        desc: "إظهار ضمائر المستخدمين التعبيرية بجانب أسمائهم في شات المحادثة"
    },
    "USRBG": {
        name: "خلفيات USRBG المخصصة (USRBG)",
        desc: "عرض وتطبيق خلفيات البروفايل المجانية من قاعدة بيانات مجتمع USRBG"
    },
    "ValidReply": {
        name: "إصلاح خطأ الردود (Valid Reply)",
        desc: "إصلاح مشكلة 'تعذر تحميل الرسالة' عند تمرير الماوس فوق معاينة الردود القديمة"
    },
    "VoiceChatDoubleClick": {
        name: "الدخول للروم بنقرتين (Voice Chat Double Click)",
        desc: "منع الدخول للرومات الصوتية بالخطأ وجعل الانضمام يتطلب النقر المزدوج بالماوس"
    },
    "VcNarrator": {
        name: "القارئ الصوتي للروم (Voice Chat Narrator)",
        desc: "نطق صوتي بأسماء من ينضم أو يغادر الروم الصوتي عبر المساعد الصوتي"
    },
    "VencordToolbox": {
        name: "زر الوصول السريع (ZenCord Quick Access)",
        desc: "إضافة أيقونة فخمة في الشريط العلوي تفتح قائمة سريعة لإعدادات زن كورد ومحرر الـ CSS وإعادة التشغيل"
    },
    "WebContextMenus": {
        name: "قوائم ديسكورد الأصلية للويب (Web Context Menus)",
        desc: "إعادة قوائم الماوس الأيمن الغنية للصور والروابط في نسخة المتصفح ديسكورد ويب"
    },
    "WebKeybinds": {
        name: "أزرار التنقل لنسخة الويب (Web Navigation Buttons)",
        desc: "إظهار أزرار الرجوع والتقدم للأمام في شريط العنوان لتسهيل التنقل في نسخة الويب"
    },
    "WebPWA": {
        name: "تطبيق ويب ديسكورد PWA (Web PWA)",
        desc: "تحسين تجربة تشغيل ديسكورد كتطبيق ويب تقدمي PWA مستقل على جهازك"
    },
    "WebScreenShare": {
        name: "مشاركة الشاشة لنسخة الويب (Web Screen Share)",
        desc: "تفعيل وتحسين مشاركة الشاشة بجودة عالية في ديسكورد ويب داخل المتصفح"
    },
    "WebScreenShareFixes": {
        name: "إصلاحات مشاركة الشاشة (Web Screen Share Fixes)",
        desc: "إلغاء حد سرعة البث 2500kbps وإصلاح مشاكل استهلاك المعالج أثناء البث المباشر"
    },
    "XSOverlay": {
        name: "إشعارات الواقع الافتراضي (XSOverlay)",
        desc: "إرسال تنبيهات ورسائل ديسكورد إلى نظارة الواقع الافتراضي VR عبر XSOverlay"
    },
    "ZenQuests": {
        name: "المهام التلقائية الفخمة (ZenQuests)",
        desc: "إكمال مهام ديسكورد تلقائياً في الخلفية وقبول المكافآت مع تنظيف الواجهة من إعلانات وبانرات المهام المزعجة"
    }
};

export function getPluginI18n(plugin: { name: string; description: string }) {
    const isArabic = Settings.plugins?.ArabicUI?.enabled || (Settings as any)?.zen?.pluginsArabic === true;
    if (isArabic) {
        const trans = pluginNameTranslations[plugin.name]
            || Object.entries(pluginNameTranslations).find(([k]) => k.toLowerCase() === plugin.name.toLowerCase())?.[1];
        if (trans) {
            return {
                name: trans.name,
                description: trans.desc
            };
        }
        if (Settings.plugins?.ArabicUI?.translatePluginList !== false) {
            const pack = pluginPacks[plugin.name]
                || Object.entries(pluginPacks).find(([k]) => k.toLowerCase() === plugin.name.toLowerCase())?.[1];
            if (pack?.description) {
                return {
                    name: pack.name ?? plugin.name,
                    description: pack.description
                };
            }
        }
    }
    return {
        name: plugin.name,
        description: plugin.description
    };
}

