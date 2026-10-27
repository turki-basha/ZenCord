/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "@api/Settings";

export const translations: Record<string, string> = {
    // Core Tabs & Navigation
    "ZenCord Settings": "إعدادات زن كورد",
    "Vencord Settings": "إعدادات زن كورد",
    "Plugins": "الإضافات البرمجية",
    "Themes": "الثيمات والمظاهر",
    "Updater": "محدث البرنامج",
    "ZenCord Updater": "محدث زن كورد",
    "Cloud": "المزامنة السحابية",
    "ZenCord Cloud": "سحابة زن كورد",
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
    "Check for Updates": "التحقق من وجود تحديثات",
    "Up to date": "الإصدار محدث",
    "Update Available": "يوجد تحديث متاح",
    "Update Now": "تحديث الآن",
    "ZenCord Quick Access": "الوصول السريع لـ ZenCord",
    "ZenCord QuickCSS": "محرر الـ QuickCSS",
    "Restart Discord": "إعادة تشغيل ديسكورد",

    // Descriptions & Hints
    "Save your ZenCord settings to the cloud so you can easily keep them the same on all your devices":
        "احفظ إعدادات زن كورد سحابياً للمزامنة السهلة بين جميع أجهزتك",
    "You can import and export your ZenCord settings as a JSON file. This allows you to easily transfer your settings to another device, or recover your settings after reinstalling ZenCord or Discord.":
        "يمكنك استيراد وتصدير إعداداتك كملف JSON لنقلها بسهولة إلى جهاز آخر أو استعادتها لاحقاً.",
    "Fake Deafen": "ديفن وهمي (Fake Deafen)",
    "Fake Mute": "ميوت وهمي (Fake Mute)",
    "Fake Video": "كاميرا وهمية (Fake Video)",
    "Automatically fake mute whenever Fake Deafen is enabled": "تفعيل الميوت الوهمي تلقائياً عند تفعيل الديفن الوهمي",
    "Show a quick popup toast notification when toggling fake states": "إظهار إشعار سريع عند تفعيل أو تعطيل الحالة الوهمية"
};

export const pluginNameTranslations: Record<string, { name: string; desc: string }> = {
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
    if (Settings.plugins?.ArabicUI?.enabled) {
        const trans = pluginNameTranslations[plugin.name]
            || Object.entries(pluginNameTranslations).find(([k]) => k.toLowerCase() === plugin.name.toLowerCase())?.[1];
        if (trans) {
            return {
                name: trans.name,
                description: trans.desc
            };
        }
    }
    return {
        name: plugin.name,
        description: plugin.description
    };
}
