using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace ZenCordInstaller
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            try
            {
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            }
            catch { }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }

    public class DiscordInstallInfo
    {
        public string Name { get; set; }
        public string Branch { get; set; }
        public string RootPath { get; set; }
        public string AppPath { get; set; }
        public string ResourcesPath { get; set; }
        public bool IsPatched { get; set; }
        public string ProcessName { get; set; }
    }

    /// <summary>
    /// Custom modern button with anti-aliasing and zero WinForms artifacts
    /// </summary>
    public class ModernButton : Control, IButtonControl
    {
        public Color BaseColor { get; set; }
        public Color HoverColor { get; set; }
        public Color PressColor { get; set; }
        public int BorderRadius { get; set; }
        public Color BorderColor { get; set; }
        public Color HoverBorderColor { get; set; }
        public int BorderWidth { get; set; }

        private bool isHovered = false;
        private bool isPressed = false;
        private DialogResult dialogResult;

        public DialogResult DialogResult
        {
            get { return dialogResult; }
            set { dialogResult = value; }
        }

        public void NotifyDefault(bool value) { }
        public void PerformClick() { OnClick(EventArgs.Empty); }

        public ModernButton()
        {
            SetStyle(
                ControlStyles.UserPaint |
                ControlStyles.AllPaintingInWmPaint |
                ControlStyles.OptimizedDoubleBuffer |
                ControlStyles.ResizeRedraw |
                ControlStyles.SupportsTransparentBackColor,
                true
            );

            BackColor = Color.Transparent;
            Cursor = Cursors.Hand;
            BorderRadius = 8;
            BorderColor = Color.Transparent;
            HoverBorderColor = Color.Transparent;
            BorderWidth = 0;
            Font = new Font("Segoe UI", 10.5f, FontStyle.Bold);
            ForeColor = Color.White;
            Size = new Size(120, 40);
        }

        protected override void OnMouseEnter(EventArgs e)
        {
            base.OnMouseEnter(e);
            isHovered = true;
            Invalidate();
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            base.OnMouseLeave(e);
            isHovered = false;
            Invalidate();
        }

        protected override void OnMouseDown(MouseEventArgs mevent)
        {
            base.OnMouseDown(mevent);
            if (mevent.Button == MouseButtons.Left)
            {
                isPressed = true;
                Invalidate();
            }
        }

        protected override void OnMouseUp(MouseEventArgs mevent)
        {
            base.OnMouseUp(mevent);
            isPressed = false;
            Invalidate();
        }

        private GraphicsPath GetRoundPath(RectangleF rect, float radius)
        {
            GraphicsPath path = new GraphicsPath();
            float d = radius * 2f;
            if (d > rect.Width) d = rect.Width;
            if (d > rect.Height) d = rect.Height;

            path.AddArc(rect.X, rect.Y, d, d, 180, 90);
            path.AddArc(rect.Right - d, rect.Y, d, d, 270, 90);
            path.AddArc(rect.Right - d, rect.Bottom - d, d, d, 0, 90);
            path.AddArc(rect.X, rect.Bottom - d, d, d, 90, 90);
            path.CloseFigure();
            return path;
        }

        protected override void OnPaint(PaintEventArgs pevent)
        {
            Graphics g = pevent.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;

            Color parentBg = Parent != null ? Parent.BackColor : Color.FromArgb(28, 36, 41);
            using (SolidBrush bgBrush = new SolidBrush(parentBg))
            {
                g.FillRectangle(bgBrush, ClientRectangle);
            }

            RectangleF rect = new RectangleF(0.5f, 0.5f, Width - 1.5f, Height - 1.5f);
            Color fill = isPressed ? PressColor : (isHovered ? HoverColor : BaseColor);
            Color border = isHovered && HoverBorderColor != Color.Transparent ? HoverBorderColor : BorderColor;

            using (GraphicsPath path = GetRoundPath(rect, BorderRadius))
            {
                using (SolidBrush fillBrush = new SolidBrush(fill))
                {
                    g.FillPath(fillBrush, path);
                }

                if (BorderWidth > 0 && border != Color.Transparent)
                {
                    using (Pen pen = new Pen(border, BorderWidth))
                    {
                        g.DrawPath(pen, path);
                    }
                }
            }

            TextFormatFlags flags = TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter | TextFormatFlags.SingleLine;
            TextRenderer.DrawText(g, Text, Font, ClientRectangle, ForeColor, flags);
        }
    }

    /// <summary>
    /// Interactive card with custom checkbox for the cleanup modal
    /// </summary>
    public class CheckCard : Control
    {
        public bool Checked { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string BadgeText { get; set; }
        public bool IsArabic { get; set; }

        private bool isHovered = false;

        public CheckCard()
        {
            SetStyle(
                ControlStyles.UserPaint |
                ControlStyles.AllPaintingInWmPaint |
                ControlStyles.OptimizedDoubleBuffer |
                ControlStyles.ResizeRedraw |
                ControlStyles.SupportsTransparentBackColor,
                true
            );

            BackColor = Color.Transparent;
            Cursor = Cursors.Hand;
            Checked = true;
            Title = "";
            Subtitle = "";
            BadgeText = "";
            IsArabic = false;
            Size = new Size(500, 64);
        }

        protected override void OnMouseEnter(EventArgs e)
        {
            base.OnMouseEnter(e);
            isHovered = true;
            Invalidate();
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            base.OnMouseLeave(e);
            isHovered = false;
            Invalidate();
        }

        protected override void OnClick(EventArgs e)
        {
            base.OnClick(e);
            Checked = !Checked;
            Invalidate();
        }

        private GraphicsPath GetRoundPath(RectangleF rect, float radius)
        {
            GraphicsPath path = new GraphicsPath();
            float d = radius * 2f;
            path.AddArc(rect.X, rect.Y, d, d, 180, 90);
            path.AddArc(rect.Right - d, rect.Y, d, d, 270, 90);
            path.AddArc(rect.Right - d, rect.Bottom - d, d, d, 0, 90);
            path.AddArc(rect.X, rect.Bottom - d, d, d, 90, 90);
            path.CloseFigure();
            return path;
        }

        protected override void OnPaint(PaintEventArgs pevent)
        {
            Graphics g = pevent.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;

            Color parentBg = Parent != null ? Parent.BackColor : Color.FromArgb(28, 36, 41);
            using (SolidBrush bgBrush = new SolidBrush(parentBg))
            {
                g.FillRectangle(bgBrush, ClientRectangle);
            }

            RectangleF rect = new RectangleF(0.5f, 0.5f, Width - 1.5f, Height - 1.5f);

            Color cardBg = Checked ? Color.FromArgb(26, 45, 66) : (isHovered ? Color.FromArgb(40, 52, 61) : Color.FromArgb(32, 40, 47));
            Color cardBorder = Checked ? Color.FromArgb(59, 130, 246) : (isHovered ? Color.FromArgb(80, 96, 110) : Color.FromArgb(55, 68, 79));
            int borderWidth = Checked ? 2 : 1;

            using (GraphicsPath path = GetRoundPath(rect, 8))
            {
                using (SolidBrush brush = new SolidBrush(cardBg))
                {
                    g.FillPath(brush, path);
                }
                using (Pen pen = new Pen(cardBorder, borderWidth))
                {
                    g.DrawPath(pen, path);
                }
            }

            // Draw Checkbox Square
            int boxSz = 20;
            int boxY = (Height - boxSz) / 2;
            int boxX = IsArabic ? Width - 32 : 12;

            RectangleF boxRect = new RectangleF(boxX, boxY, boxSz, boxSz);
            using (GraphicsPath boxPath = GetRoundPath(boxRect, 4))
            {
                if (Checked)
                {
                    using (SolidBrush boxBrush = new SolidBrush(Color.FromArgb(59, 130, 246)))
                    {
                        g.FillPath(boxBrush, boxPath);
                    }
                    // Draw checkmark
                    using (Pen checkPen = new Pen(Color.White, 2.2f))
                    {
                        checkPen.StartCap = LineCap.Round;
                        checkPen.EndCap = LineCap.Round;
                        g.DrawLine(checkPen, boxX + 4.5f, boxY + 10f, boxX + 8.5f, boxY + 14.5f);
                        g.DrawLine(checkPen, boxX + 8.5f, boxY + 14.5f, boxX + 15.5f, boxY + 5.5f);
                    }
                }
                else
                {
                    using (SolidBrush boxBrush = new SolidBrush(Color.FromArgb(24, 30, 35)))
                    {
                        g.FillPath(boxBrush, boxPath);
                    }
                    using (Pen boxBorder = new Pen(Color.FromArgb(90, 107, 120), 1.5f))
                    {
                        g.DrawPath(boxBorder, boxPath);
                    }
                }
            }

            // Draw Text
            using (Font titleFont = new Font("Segoe UI", 10.25f, FontStyle.Bold))
            using (Font subFont = new Font("Segoe UI", 8.5f, FontStyle.Regular))
            using (Font badgeFont = new Font("Segoe UI", 8f, FontStyle.Bold))
            {
                if (IsArabic)
                {
                    int textRight = boxX - 12;
                    int textW = textRight - 90;

                    // Title
                    TextRenderer.DrawText(g, Title, titleFont, new Point(textRight, 10), Color.White, TextFormatFlags.Right | TextFormatFlags.NoPadding);

                    // Subtitle
                    TextRenderer.DrawText(g, Subtitle, subFont, new Point(textRight, 35), Color.FromArgb(145, 165, 180), TextFormatFlags.Right | TextFormatFlags.NoPadding);

                    // Badge (Size or Status on left)
                    if (!string.IsNullOrEmpty(BadgeText))
                    {
                        Size bSz = TextRenderer.MeasureText(g, BadgeText, badgeFont);
                        RectangleF badgeRect = new RectangleF(14, (Height - 22) / 2, bSz.Width + 12, 22);
                        using (GraphicsPath bPath = GetRoundPath(badgeRect, 11))
                        {
                            using (SolidBrush bBg = new SolidBrush(Color.FromArgb(38, 55, 70)))
                            {
                                g.FillPath(bBg, bPath);
                            }
                        }
                        TextRenderer.DrawText(g, BadgeText, badgeFont, new Rectangle((int)badgeRect.X, (int)badgeRect.Y, (int)badgeRect.Width, (int)badgeRect.Height), Color.FromArgb(147, 197, 253), TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter);
                    }
                }
                else
                {
                    int textLeft = boxX + boxSz + 12;

                    // Title
                    TextRenderer.DrawText(g, Title, titleFont, new Point(textLeft, 10), Color.White, TextFormatFlags.NoPadding);

                    // Subtitle
                    TextRenderer.DrawText(g, Subtitle, subFont, new Point(textLeft, 35), Color.FromArgb(145, 165, 180), TextFormatFlags.NoPadding);

                    // Badge on right
                    if (!string.IsNullOrEmpty(BadgeText))
                    {
                        Size bSz = TextRenderer.MeasureText(g, BadgeText, badgeFont);
                        RectangleF badgeRect = new RectangleF(Width - bSz.Width - 26, (Height - 22) / 2, bSz.Width + 12, 22);
                        using (GraphicsPath bPath = GetRoundPath(badgeRect, 11))
                        {
                            using (SolidBrush bBg = new SolidBrush(Color.FromArgb(38, 55, 70)))
                            {
                                g.FillPath(bBg, bPath);
                            }
                        }
                        TextRenderer.DrawText(g, BadgeText, badgeFont, new Rectangle((int)badgeRect.X, (int)badgeRect.Y, (int)badgeRect.Width, (int)badgeRect.Height), Color.FromArgb(147, 197, 253), TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter);
                    }
                }
            }
        }
    }

    /// <summary>
    /// Modal dialog to selectively clean and wipe ZenCord/Vencord files, settings, and cache
    /// </summary>
    public class CleanDialog : Form
    {
        private bool isArabic;
        private List<DiscordInstallInfo> allInstalls;

        private Label titleLabel;
        private Label subLabel;
        private CheckCard cardZenCord;
        private CheckCard cardVencord;
        private CheckCard cardDiscordCache;
        private CheckCard cardUnpatch;
        private ModernButton btnSelectAll;
        private ModernButton btnClean;
        private ModernButton btnCancel;

        private bool allSelected = true;

        [DllImport("dwmapi.dll")]
        private static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        public CleanDialog(bool isArabic, List<DiscordInstallInfo> installs, Icon appIcon)
        {
            this.isArabic = isArabic;
            this.allInstalls = installs;
            if (appIcon != null) Icon = appIcon;

            InitializeUI();
            ApplyDarkTitleBar();
        }

        private void ApplyDarkTitleBar()
        {
            try
            {
                int val = 1;
                DwmSetWindowAttribute(Handle, 20, ref val, sizeof(int));
                DwmSetWindowAttribute(Handle, 19, ref val, sizeof(int));
            }
            catch { }
        }

        private long GetDirSize(string path)
        {
            if (!Directory.Exists(path)) return 0;
            try
            {
                long sz = 0;
                var dir = new DirectoryInfo(path);
                foreach (var f in dir.GetFiles("*", SearchOption.AllDirectories))
                {
                    sz += f.Length;
                }
                return sz;
            }
            catch { return 0; }
        }

        private string FormatSize(long bytes)
        {
            if (bytes <= 0) return "";
            if (bytes < 1024 * 1024) return string.Format("{0:0.#} KB", bytes / 1024.0);
            return string.Format("{0:0.#} MB", bytes / (1024.0 * 1024.0));
        }

        private void InitializeUI()
        {
            Text = isArabic ? "أداة تنظيف ملفات وكاش ZenCord / Vencord" : "ZenCord / Vencord Cleanup Tool";
            BackColor = Color.FromArgb(28, 36, 41);
            ClientSize = new Size(620, 530);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            StartPosition = FormStartPosition.CenterParent;
            Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            ForeColor = Color.White;

            string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string zenCordPath = Path.Combine(appData, "ZenCord");
            string vencordPath = Path.Combine(appData, "Vencord");

            long zenCordSize = GetDirSize(zenCordPath);
            long vencordSize = GetDirSize(vencordPath);

            // 1. Header Title
            titleLabel = new Label
            {
                Location = new Point(28, 20),
                Size = new Size(ClientSize.Width - 56, 32),
                Font = new Font("Segoe UI", 14f, FontStyle.Bold),
                ForeColor = Color.White,
                Text = isArabic ? "🧹 تنظيف ملفات ومخلفات ZenCord / Vencord" : "🧹 Clean ZenCord / Vencord Files & Cache",
                TextAlign = isArabic ? ContentAlignment.MiddleRight : ContentAlignment.MiddleLeft,
                RightToLeft = isArabic ? RightToLeft.Yes : RightToLeft.No
            };
            Controls.Add(titleLabel);

            // 2. Subtitle
            subLabel = new Label
            {
                Location = new Point(28, 54),
                Size = new Size(ClientSize.Width - 56, 26),
                Font = new Font("Segoe UI", 9.5f, FontStyle.Regular),
                ForeColor = Color.FromArgb(145, 165, 180),
                Text = isArabic ? "حدد العناصر التي ترغب في حذفها بالكامل كأنك لم تثبتها من قبل:" : "Select the items you want to completely wipe as if never installed:",
                TextAlign = isArabic ? ContentAlignment.MiddleRight : ContentAlignment.MiddleLeft,
                RightToLeft = isArabic ? RightToLeft.Yes : RightToLeft.No
            };
            Controls.Add(subLabel);

            // 3. CheckCards
            int cardW = ClientSize.Width - 56;
            int cardH = 64;
            int startY = 92;
            int gap = 12;

            // Card 1: ZenCord
            cardZenCord = new CheckCard
            {
                Location = new Point(28, startY),
                Size = new Size(cardW, cardH),
                IsArabic = isArabic,
                Checked = Directory.Exists(zenCordPath),
                Title = isArabic ? "ملفات وإعدادات ZenCord بالكامل (%AppData%\\ZenCord)" : "ZenCord Files & Settings (%AppData%\\ZenCord)",
                Subtitle = isArabic ? "حذف مجلد الإضافات، الثيمات، وملفات التشغيل والإعدادات" : "Purges plugins, themes, dist runtime files, and configurations",
                BadgeText = zenCordSize > 0 ? FormatSize(zenCordSize) : (Directory.Exists(zenCordPath) ? (isArabic ? "موجود" : "Found") : (isArabic ? "غير موجود" : "Not Found"))
            };
            Controls.Add(cardZenCord);

            // Card 2: Vencord
            cardVencord = new CheckCard
            {
                Location = new Point(28, startY + (cardH + gap)),
                Size = new Size(cardW, cardH),
                IsArabic = isArabic,
                Checked = Directory.Exists(vencordPath),
                Title = isArabic ? "ملفات وإعدادات Vencord القديمة (%AppData%\\Vencord)" : "Legacy Vencord Files & Settings (%AppData%\\Vencord)",
                Subtitle = isArabic ? "حذف مجلد مخلفات وإعدادات Vencord القديمة بالكامل" : "Completely deletes all leftover Vencord files, settings, and caches",
                BadgeText = vencordSize > 0 ? FormatSize(vencordSize) : (Directory.Exists(vencordPath) ? (isArabic ? "موجود" : "Found") : (isArabic ? "غير موجود" : "Not Found"))
            };
            Controls.Add(cardVencord);

            // Card 3: Discord Caches
            cardDiscordCache = new CheckCard
            {
                Location = new Point(28, startY + (cardH + gap) * 2),
                Size = new Size(cardW, cardH),
                IsArabic = isArabic,
                Checked = true,
                Title = isArabic ? "كاش ديسكورد المؤقت (Cache & GPUCache)" : "Discord Temporary App Caches (Cache & GPUCache)",
                Subtitle = isArabic ? "تنظيف الكاش في جميع نسخ ديسكورد لتفريغ المساحة وإزالة أي كاش قديم" : "Clears Cache, Code Cache & GPUCache to refresh Discord UI completely",
                BadgeText = isArabic ? "موصى به" : "Recommended"
            };
            Controls.Add(cardDiscordCache);

            // Card 4: Unpatch All
            cardUnpatch = new CheckCard
            {
                Location = new Point(28, startY + (cardH + gap) * 3),
                Size = new Size(cardW, cardH),
                IsArabic = isArabic,
                Checked = true,
                Title = isArabic ? "إلغاء التعديل واستعادة ديسكورد الأصلي (Unpatch All)" : "Unpatch & Restore Default Discord (Unpatch All)",
                Subtitle = isArabic ? "استعادة ملف _app.asar الأصلي وإزالة أي باتش في جميع نسخ ديسكورد" : "Restores original _app.asar and cleans patch files across all Discords",
                BadgeText = isArabic ? "استعادة الأصل" : "Restore Clean"
            };
            Controls.Add(cardUnpatch);

            // 4. Select All Link/Button
            btnSelectAll = new ModernButton
            {
                Location = new Point(28, 410),
                Size = new Size(130, 30),
                BaseColor = Color.FromArgb(37, 46, 54),
                HoverColor = Color.FromArgb(50, 62, 72),
                PressColor = Color.FromArgb(28, 36, 42),
                BorderColor = Color.FromArgb(63, 78, 88),
                BorderWidth = 1,
                BorderRadius = 15,
                Font = new Font("Segoe UI", 9f, FontStyle.Bold),
                ForeColor = Color.FromArgb(200, 215, 230),
                Text = isArabic ? "تحديد الكل" : "Select All"
            };
            btnSelectAll.Click += (s, e) =>
            {
                allSelected = !allSelected;
                cardZenCord.Checked = allSelected;
                cardVencord.Checked = allSelected;
                cardDiscordCache.Checked = allSelected;
                cardUnpatch.Checked = allSelected;
                cardZenCord.Invalidate();
                cardVencord.Invalidate();
                cardDiscordCache.Invalidate();
                cardUnpatch.Invalidate();
                btnSelectAll.Text = allSelected ? (isArabic ? "إلغاء التحديد" : "Deselect All") : (isArabic ? "تحديد الكل" : "Select All");
            };
            Controls.Add(btnSelectAll);

            // 5. Action Buttons (Clean & Cancel)
            int bottomY = 460;

            btnClean = new ModernButton
            {
                Location = new Point(ClientSize.Width - 28 - 210, bottomY),
                Size = new Size(210, 44),
                BaseColor = Color.FromArgb(217, 48, 37),
                HoverColor = Color.FromArgb(234, 67, 53),
                PressColor = Color.FromArgb(181, 34, 25),
                BorderRadius = 8,
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold),
                Text = isArabic ? "🧹 حذف وتنظيف المحدد" : "🧹 Clean & Wipe Selected"
            };
            btnClean.Click += (s, e) => PerformClean();
            Controls.Add(btnClean);

            btnCancel = new ModernButton
            {
                Location = new Point(ClientSize.Width - 28 - 210 - 12 - 110, bottomY),
                Size = new Size(110, 44),
                BaseColor = Color.FromArgb(45, 55, 63),
                HoverColor = Color.FromArgb(58, 70, 80),
                PressColor = Color.FromArgb(35, 43, 50),
                BorderRadius = 8,
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold),
                Text = isArabic ? "إلغاء" : "Cancel"
            };
            btnCancel.Click += (s, e) =>
            {
                DialogResult = DialogResult.Cancel;
                Close();
            };
            Controls.Add(btnCancel);
        }

        private static bool TryDeleteDir(string path)
        {
            try
            {
                if (Directory.Exists(path))
                {
                    foreach (var f in Directory.GetFiles(path, "*", SearchOption.AllDirectories))
                    {
                        try { File.SetAttributes(f, FileAttributes.Normal); } catch { }
                    }
                    Directory.Delete(path, true);
                    return true;
                }
            }
            catch { }
            return false;
        }

        private void PerformClean()
        {
            string confirmMsg = isArabic
                ? "سيتم إغلاق جميع نسخ ديسكورد وحذف العناصر المحددة نهائياً كأنك لم تثبتها من قبل.\n\nهل أنت متأكد من الاستمرار؟"
                : "Discord will be closed and all selected items will be permanently removed as if never installed.\n\nAre you sure you want to proceed?";

            if (MessageBox.Show(this, confirmMsg, isArabic ? "تأكيد التنظيف الشامل" : "Confirm Cleanup", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes)
                return;

            int deletedFolders = 0;
            int unpatchedCount = 0;

            // 1. Terminate Discord processes
            string[] procs = { "Discord", "DiscordPTB", "DiscordCanary", "DiscordDevelopment" };
            foreach (var name in procs)
            {
                try
                {
                    foreach (var p in Process.GetProcessesByName(name))
                    {
                        p.Kill();
                        p.WaitForExit(2000);
                    }
                }
                catch { }
            }
            Thread.Sleep(500);

            string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            // 2. ZenCord deletion
            if (cardZenCord.Checked)
            {
                string p = Path.Combine(appData, "ZenCord");
                if (Directory.Exists(p)) { TryDeleteDir(p); deletedFolders++; }
                string pLocal = Path.Combine(localAppData, "ZenCord");
                if (Directory.Exists(pLocal)) { TryDeleteDir(pLocal); deletedFolders++; }
            }

            // 3. Vencord deletion
            if (cardVencord.Checked)
            {
                string p = Path.Combine(appData, "Vencord");
                if (Directory.Exists(p)) { TryDeleteDir(p); deletedFolders++; }
                string pLocal = Path.Combine(localAppData, "Vencord");
                if (Directory.Exists(pLocal)) { TryDeleteDir(pLocal); deletedFolders++; }
            }

            // 4. Discord Caches
            if (cardDiscordCache.Checked)
            {
                string[] discordDataFolders = { "discord", "discordptb", "discordcanary", "discorddevelopment" };
                string[] cacheNames = { "Cache", "Code Cache", "GPUCache", "DawnCache" };
                foreach (var df in discordDataFolders)
                {
                    string baseFolder = Path.Combine(appData, df);
                    if (Directory.Exists(baseFolder))
                    {
                        foreach (var cn in cacheNames)
                        {
                            string cp = Path.Combine(baseFolder, cn);
                            if (Directory.Exists(cp)) { TryDeleteDir(cp); deletedFolders++; }
                        }
                    }
                }
            }

            // 5. Unpatch all Discords
            if (cardUnpatch.Checked && allInstalls != null)
            {
                foreach (var inst in allInstalls)
                {
                    try
                    {
                        string resDir = inst.ResourcesPath;
                        string appAsar = Path.Combine(resDir, "app.asar");
                        string backupAsar = Path.Combine(resDir, "_app.asar");

                        if (File.Exists(backupAsar))
                        {
                            if (File.Exists(appAsar)) File.Delete(appAsar);
                            File.Move(backupAsar, appAsar);
                            unpatchedCount++;
                        }
                        else if (File.Exists(appAsar))
                        {
                            FileInfo fi = new FileInfo(appAsar);
                            if (fi.Length < 10000)
                            {
                                File.Delete(appAsar);
                                unpatchedCount++;
                            }
                        }
                        inst.IsPatched = false;
                    }
                    catch { }
                }
            }

            string successMsg = isArabic
                ? string.Format("اكتمل التنظيف بنجاح!\n\n• تم حذف وتفريغ {0} مجلد/كاش.\n• تم استعادة النسخ الأصلية لديسكورد: {1}.\n\nأصبح جهازك نظيفاً تماماً كأنك لم تثبت ZenCord أو Vencord من قبل.", deletedFolders, unpatchedCount)
                : string.Format("Cleanup completed successfully!\n\n• Cleaned {0} folders/cache directories.\n• Restored default Discords: {1}.\n\nYour system is completely clean as if ZenCord or Vencord was never installed.", deletedFolders, unpatchedCount);

            MessageBox.Show(this, successMsg, isArabic ? "تم التنظيف بنجاح" : "Cleanup Complete", MessageBoxButtons.OK, MessageBoxIcon.Information);
            DialogResult = DialogResult.OK;
            Close();
        }
    }

    public class MainForm : Form
    {
        private bool isArabic = false;

        // UI Controls
        private PictureBox bannerBox;
        private ModernButton langToggleBtn;
        private ModernButton cleanDataBtn;
        private Panel noticePanel;
        private Label noticeLabel;
        private Label sectionTitleLabel;
        private Panel installsContainer;
        private ModernButton btnInstall;
        private ModernButton btnRepair;
        private ModernButton btnUninstall;
        private ModernButton btnOpenAsar;
        private Label statusLabel;

        private List<DiscordInstallInfo> installs = new List<DiscordInstallInfo>();
        private int selectedInstallIndex = 0;
        private Image bannerImage;
        private Icon appIcon;

        // Palette
        private readonly Color bgDark = Color.FromArgb(28, 36, 41);
        private readonly Color noticeBg = Color.FromArgb(222, 196, 73);
        private readonly Color noticeText = Color.FromArgb(17, 17, 17);
        private readonly Color btnInstallColor = Color.FromArgb(15, 157, 88);
        private readonly Color btnInstallHover = Color.FromArgb(19, 181, 102);
        private readonly Color btnRepairColor = Color.FromArgb(77, 93, 251);
        private readonly Color btnRepairHover = Color.FromArgb(97, 112, 252);
        private readonly Color btnUninstallColor = Color.FromArgb(217, 48, 37);
        private readonly Color btnUninstallHover = Color.FromArgb(234, 67, 53);
        private readonly Color btnOpenAsarColor = Color.FromArgb(0, 122, 90);
        private readonly Color btnOpenAsarHover = Color.FromArgb(0, 150, 109);

        // Win32 dark title bar support
        [DllImport("dwmapi.dll")]
        private static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        public MainForm()
        {
            InitializeComponent();
            ApplyDarkTitleBar();
            ScanDiscords();
            UpdateLanguage();
        }

        private void ApplyDarkTitleBar()
        {
            try
            {
                int val = 1;
                DwmSetWindowAttribute(Handle, 20, ref val, sizeof(int));
                DwmSetWindowAttribute(Handle, 19, ref val, sizeof(int));
            }
            catch { }
        }

        private void LoadEmbeddedAssets()
        {
            try
            {
                Assembly asm = Assembly.GetExecutingAssembly();
                using (Stream stream = asm.GetManifestResourceStream("banner.png"))
                {
                    if (stream != null)
                        bannerImage = Image.FromStream(stream);
                }
            }
            catch { }

            try
            {
                Assembly asm = Assembly.GetExecutingAssembly();
                using (Stream stream = asm.GetManifestResourceStream("ZenCord.ico"))
                {
                    if (stream != null)
                    {
                        appIcon = new Icon(stream);
                        Icon = appIcon;
                    }
                }
            }
            catch { }
        }

        private void InitializeComponent()
        {
            LoadEmbeddedAssets();

            Text = "ZenCord Installer";
            BackColor = bgDark;
            ClientSize = new Size(940, 640);
            MinimumSize = new Size(940, 640);
            StartPosition = FormStartPosition.CenterScreen;
            DoubleBuffered = true;
            Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            ForeColor = Color.White;

            // 1. Language Toggle Button (Top Right)
            langToggleBtn = new ModernButton
            {
                Size = new Size(136, 36),
                Location = new Point(ClientSize.Width - 160, 18),
                Anchor = AnchorStyles.Top | AnchorStyles.Right,
                BaseColor = Color.FromArgb(34, 43, 50),
                HoverColor = Color.FromArgb(43, 54, 63),
                PressColor = Color.FromArgb(28, 36, 42),
                BorderColor = Color.FromArgb(68, 82, 94),
                HoverBorderColor = Color.FromArgb(88, 101, 242), // Blurple glow
                BorderWidth = 1,
                BorderRadius = 18,
                Font = new Font("Segoe UI", 10f, FontStyle.Bold),
                ForeColor = Color.FromArgb(235, 240, 245),
                Text = "🌐 العربية"
            };
            langToggleBtn.Click += (s, e) =>
            {
                isArabic = !isArabic;
                UpdateLanguage();
            };
            Controls.Add(langToggleBtn);

            // 2. Clean Cache & Files Button (Top Left)
            cleanDataBtn = new ModernButton
            {
                Size = new Size(185, 36),
                Location = new Point(36, 18),
                Anchor = AnchorStyles.Top | AnchorStyles.Left,
                BaseColor = Color.FromArgb(34, 43, 50),
                HoverColor = Color.FromArgb(43, 54, 63),
                PressColor = Color.FromArgb(28, 36, 42),
                BorderColor = Color.FromArgb(68, 82, 94),
                HoverBorderColor = Color.FromArgb(245, 158, 11), // Amber glow
                BorderWidth = 1,
                BorderRadius = 18,
                Font = new Font("Segoe UI", 9.5f, FontStyle.Bold),
                ForeColor = Color.FromArgb(235, 240, 245),
                Text = "🧹 تنظيف الكاش والملفات"
            };
            cleanDataBtn.Click += (s, e) =>
            {
                using (CleanDialog dlg = new CleanDialog(isArabic, installs, appIcon))
                {
                    if (dlg.ShowDialog(this) == DialogResult.OK)
                    {
                        ScanDiscords();
                        RenderInstallItems();
                    }
                }
            };
            Controls.Add(cleanDataBtn);

            // 3. Banner PictureBox (Top Center)
            bannerBox = new PictureBox
            {
                Size = new Size(390, 150),
                Location = new Point((ClientSize.Width - 390) / 2, 10),
                SizeMode = PictureBoxSizeMode.Zoom,
                BackColor = Color.Transparent,
                Image = bannerImage
            };
            Controls.Add(bannerBox);

            // 4. Notice Panel (Yellow Warning Box)
            noticePanel = new Panel
            {
                Size = new Size(ClientSize.Width - 72, 84),
                Location = new Point(36, 170),
                BackColor = noticeBg,
                Padding = new Padding(18, 12, 18, 12)
            };
            noticePanel.Paint += (s, e) =>
            {
                e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                using (GraphicsPath path = GetRoundedPath(new RectangleF(0.5f, 0.5f, noticePanel.Width - 1.5f, noticePanel.Height - 1.5f), 8))
                {
                    using (Pen pen = new Pen(Color.FromArgb(199, 174, 59), 1))
                    {
                        e.Graphics.DrawPath(pen, path);
                    }
                }
            };

            noticeLabel = new Label
            {
                Dock = DockStyle.Fill,
                BackColor = Color.Transparent,
                ForeColor = noticeText,
                Font = new Font("Segoe UI", 9.75f, FontStyle.Regular),
                TextAlign = ContentAlignment.MiddleLeft
            };
            noticePanel.Controls.Add(noticeLabel);
            Controls.Add(noticePanel);

            // 5. Section Title ("Please select an install to patch")
            sectionTitleLabel = new Label
            {
                Location = new Point(36, 268),
                Size = new Size(ClientSize.Width - 72, 34),
                Font = new Font("Segoe UI", 15f, FontStyle.Bold),
                ForeColor = Color.White,
                BackColor = Color.Transparent,
                TextAlign = ContentAlignment.MiddleLeft
            };
            Controls.Add(sectionTitleLabel);

            // 6. Installs Container (Radio List)
            installsContainer = new Panel
            {
                Location = new Point(36, 310),
                Size = new Size(ClientSize.Width - 72, 168),
                BackColor = Color.Transparent,
                AutoScroll = true
            };
            Controls.Add(installsContainer);

            // 7. Action Buttons Row (Install, Reinstall/Repair, Uninstall, Install OpenAsar)
            int btnY = 494;
            int totalW = ClientSize.Width - 72;
            int gap = 14;
            int btnW = (totalW - (gap * 3)) / 4;
            int btnH = 46;

            btnInstall = new ModernButton
            {
                Location = new Point(36, btnY),
                Size = new Size(btnW, btnH),
                BaseColor = btnInstallColor,
                HoverColor = btnInstallHover,
                PressColor = Color.FromArgb(12, 128, 71),
                BorderRadius = 8,
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold)
            };
            btnInstall.Click += (s, e) => DoInstall(false);
            Controls.Add(btnInstall);

            btnRepair = new ModernButton
            {
                Location = new Point(36 + btnW + gap, btnY),
                Size = new Size(btnW, btnH),
                BaseColor = btnRepairColor,
                HoverColor = btnRepairHover,
                PressColor = Color.FromArgb(60, 75, 214),
                BorderRadius = 8,
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold)
            };
            btnRepair.Click += (s, e) => DoInstall(true);
            Controls.Add(btnRepair);

            btnUninstall = new ModernButton
            {
                Location = new Point(36 + (btnW + gap) * 2, btnY),
                Size = new Size(btnW, btnH),
                BaseColor = btnUninstallColor,
                HoverColor = btnUninstallHover,
                PressColor = Color.FromArgb(181, 34, 25),
                BorderRadius = 8,
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold)
            };
            btnUninstall.Click += (s, e) => DoUninstall();
            Controls.Add(btnUninstall);

            btnOpenAsar = new ModernButton
            {
                Location = new Point(36 + (btnW + gap) * 3, btnY),
                Size = new Size(btnW, btnH),
                BaseColor = btnOpenAsarColor,
                HoverColor = btnOpenAsarHover,
                PressColor = Color.FromArgb(0, 99, 73),
                BorderRadius = 8,
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold)
            };
            btnOpenAsar.Click += (s, e) => DoInstallOpenAsar();
            Controls.Add(btnOpenAsar);

            // 8. Status Label (Bottom info)
            statusLabel = new Label
            {
                Location = new Point(36, 554),
                Size = new Size(ClientSize.Width - 72, 28),
                Font = new Font("Segoe UI", 9.75f, FontStyle.Regular),
                ForeColor = Color.FromArgb(140, 160, 175),
                TextAlign = ContentAlignment.MiddleCenter,
                BackColor = Color.Transparent
            };
            Controls.Add(statusLabel);

            Resize += (s, e) =>
            {
                bannerBox.Location = new Point((ClientSize.Width - bannerBox.Width) / 2, 10);
                noticePanel.Width = ClientSize.Width - 72;
                sectionTitleLabel.Width = ClientSize.Width - 72;
                installsContainer.Width = ClientSize.Width - 72;
                int nw = (ClientSize.Width - 72 - (gap * 3)) / 4;
                btnInstall.Width = nw;
                btnRepair.Location = new Point(36 + nw + gap, btnY);
                btnRepair.Width = nw;
                btnUninstall.Location = new Point(36 + (nw + gap) * 2, btnY);
                btnUninstall.Width = nw;
                btnOpenAsar.Location = new Point(36 + (nw + gap) * 3, btnY);
                btnOpenAsar.Width = nw;
                statusLabel.Width = ClientSize.Width - 72;
                RenderInstallItems();
            };
        }

        private GraphicsPath GetRoundedPath(RectangleF rect, float radius)
        {
            GraphicsPath path = new GraphicsPath();
            float d = radius * 2f;
            path.AddArc(rect.X, rect.Y, d, d, 180, 90);
            path.AddArc(rect.Right - d, rect.Y, d, d, 270, 90);
            path.AddArc(rect.Right - d, rect.Bottom - d, d, d, 0, 90);
            path.AddArc(rect.X, rect.Bottom - d, d, d, 90, 90);
            path.CloseFigure();
            return path;
        }

        private void ScanDiscords()
        {
            installs.Clear();
            string localApp = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            var targets = new[]
            {
                new { Name = "Discord", Branch = "stable", Folder = Path.Combine(localApp, "Discord"), Proc = "Discord" },
                new { Name = "Discord PTB", Branch = "ptb", Folder = Path.Combine(localApp, "DiscordPTB"), Proc = "DiscordPTB" },
                new { Name = "Discord Canary", Branch = "canary", Folder = Path.Combine(localApp, "DiscordCanary"), Proc = "DiscordCanary" },
                new { Name = "Discord Development", Branch = "development", Folder = Path.Combine(localApp, "DiscordDevelopment"), Proc = "DiscordDevelopment" }
            };

            foreach (var t in targets)
            {
                if (Directory.Exists(t.Folder))
                {
                    string[] appDirs = Directory.GetDirectories(t.Folder, "app-*");
                    if (appDirs.Length > 0)
                    {
                        Array.Sort(appDirs);
                        string latestApp = appDirs[appDirs.Length - 1];
                        string resDir = Path.Combine(latestApp, "resources");

                        bool patched = false;
                        string appAsar = Path.Combine(resDir, "app.asar");
                        string backupAsar = Path.Combine(resDir, "_app.asar");

                        if (File.Exists(backupAsar))
                        {
                            patched = true;
                        }
                        else if (File.Exists(appAsar))
                        {
                            try
                            {
                                FileInfo fi = new FileInfo(appAsar);
                                if (fi.Length < 10000)
                                {
                                    string text = File.ReadAllText(appAsar);
                                    if (text.Contains("ZenCord") || text.Contains("Vencord") || text.Contains("patcher.js"))
                                        patched = true;
                                }
                            }
                            catch { }
                        }

                        installs.Add(new DiscordInstallInfo
                        {
                            Name = t.Name,
                            Branch = t.Branch,
                            RootPath = t.Folder,
                            AppPath = latestApp,
                            ResourcesPath = resDir,
                            IsPatched = patched,
                            ProcessName = t.Proc
                        });
                    }
                }
            }

            RenderInstallItems();
        }

        private void RenderInstallItems()
        {
            installsContainer.Controls.Clear();
            if (installs.Count == 0)
            {
                Label emptyLabel = new Label
                {
                    Text = isArabic ? "لم يتم العثور على أي تثبيت لديسكورد في المسارات القياسية." : "No Discord installations were found in standard locations.",
                    ForeColor = Color.FromArgb(200, 210, 220),
                    Font = new Font("Segoe UI", 11f, FontStyle.Regular),
                    AutoSize = true,
                    Location = new Point(10, 20)
                };
                installsContainer.Controls.Add(emptyLabel);
                return;
            }

            int itemH = 40;
            for (int i = 0; i < installs.Count; i++)
            {
                int index = i;
                DiscordInstallInfo info = installs[i];
                Panel row = new Panel
                {
                    Size = new Size(installsContainer.Width - 10, itemH),
                    Location = new Point(0, i * itemH),
                    BackColor = Color.Transparent,
                    Cursor = Cursors.Hand
                };

                row.Paint += (s, e) =>
                {
                    Graphics g = e.Graphics;
                    g.SmoothingMode = SmoothingMode.AntiAlias;
                    g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;

                    bool isSelected = (selectedInstallIndex == index);

                    int circleD = 18;
                    int circleY = (row.Height - circleD) / 2;

                    string title = info.Name;
                    if (info.IsPatched)
                    {
                        title += isArabic ? " (ZenCord مثبت)" : " (ZenCord Installed)";
                    }
                    string pathText = info.RootPath;

                    using (Font boldFont = new Font("Segoe UI", 10.75f, FontStyle.Bold))
                    using (Font pathFont = new Font("Segoe UI", 9.5f, FontStyle.Regular))
                    {
                        if (isArabic)
                        {
                            int circleX = row.Width - 28;

                            using (Pen pen = new Pen(isSelected ? Color.FromArgb(59, 130, 246) : Color.FromArgb(74, 88, 99), 2))
                            {
                                g.DrawEllipse(pen, circleX, circleY, circleD, circleD);
                            }
                            if (isSelected)
                            {
                                using (SolidBrush brush = new SolidBrush(Color.FromArgb(59, 130, 246)))
                                {
                                    g.FillEllipse(brush, circleX + 4, circleY + 4, circleD - 8, circleD - 8);
                                }
                            }

                            Size titleSz = TextRenderer.MeasureText(g, title, boldFont);
                            Size pathSz = TextRenderer.MeasureText(g, pathText, pathFont);

                            int titleX = circleX - 12 - titleSz.Width;
                            int pathX = titleX - 14 - pathSz.Width;
                            if (pathX < 10) pathX = 10;

                            TextRenderer.DrawText(g, title, boldFont, new Point(titleX, 9), Color.White, TextFormatFlags.NoPadding);
                            TextRenderer.DrawText(g, pathText, pathFont, new Point(pathX, 11), Color.FromArgb(139, 157, 170), TextFormatFlags.NoPadding);
                        }
                        else
                        {
                            int circleX = 10;

                            using (Pen pen = new Pen(isSelected ? Color.FromArgb(59, 130, 246) : Color.FromArgb(74, 88, 99), 2))
                            {
                                g.DrawEllipse(pen, circleX, circleY, circleD, circleD);
                            }
                            if (isSelected)
                            {
                                using (SolidBrush brush = new SolidBrush(Color.FromArgb(59, 130, 246)))
                                {
                                    g.FillEllipse(brush, circleX + 4, circleY + 4, circleD - 8, circleD - 8);
                                }
                            }

                            int textLeft = 38;
                            TextRenderer.DrawText(g, title, boldFont, new Point(textLeft, 9), Color.White, TextFormatFlags.NoPadding);
                            Size titleSz = TextRenderer.MeasureText(g, title, boldFont);
                            TextRenderer.DrawText(g, pathText, pathFont, new Point(textLeft + titleSz.Width + 12, 11), Color.FromArgb(139, 157, 170), TextFormatFlags.NoPadding);
                        }
                    }
                };

                row.Click += (s, e) =>
                {
                    selectedInstallIndex = index;
                    installsContainer.Invalidate(true);
                };

                installsContainer.Controls.Add(row);
            }
        }

        private void UpdateLanguage()
        {
            if (isArabic)
            {
                langToggleBtn.Text = "🌐 English";
                cleanDataBtn.Text = "🧹 تنظيف الكاش والملفات";

                noticeLabel.Text = "مستودع Github (turki-basha/ZenCord) هو المصدر الرسمي والوحيد للحصول على ZenCord. أي موقع آخر يدّعي ذلك فهو خبيث.\nإذا قمت بالتحميل من أي مصدر آخر، نوصيك بالحذف الفوري وإجراء فحص أمني وتغيير كلمة مرور ديسكورد.";
                noticeLabel.RightToLeft = RightToLeft.Yes;
                noticeLabel.TextAlign = ContentAlignment.MiddleRight;

                sectionTitleLabel.Text = "يرجى تحديد تثبيت ديسكورد لتعديله";
                sectionTitleLabel.RightToLeft = RightToLeft.Yes;
                sectionTitleLabel.TextAlign = ContentAlignment.MiddleRight;

                btnInstall.Text = "تثبيت ZenCord";
                btnRepair.Text = "إعادة تثبيت / إصلاح";
                btnUninstall.Text = "إلغاء التثبيت";
                btnOpenAsar.Text = "تثبيت OpenAsar";
                statusLabel.Text = "جاهز لتثبيت أو إدارة ZenCord";
            }
            else
            {
                langToggleBtn.Text = "🌐 العربية";
                cleanDataBtn.Text = "🧹 Clean Cache & Files";

                noticeLabel.Text = "Github (turki-basha/ZenCord) is the only official place to get ZenCord. Any other site claiming to be us is malicious.\nIf you downloaded from any other source, you should delete / uninstall everything immediately, run a malware scan and change your Discord password.";
                noticeLabel.RightToLeft = RightToLeft.No;
                noticeLabel.TextAlign = ContentAlignment.MiddleLeft;

                sectionTitleLabel.Text = "Please select an install to patch";
                sectionTitleLabel.RightToLeft = RightToLeft.No;
                sectionTitleLabel.TextAlign = ContentAlignment.MiddleLeft;

                btnInstall.Text = "Install";
                btnRepair.Text = "Reinstall / Repair";
                btnUninstall.Text = "Uninstall";
                btnOpenAsar.Text = "Install OpenAsar";
                statusLabel.Text = "Ready to patch or manage ZenCord";
            }

            RenderInstallItems();
        }

        private void KillDiscordProcess(string procName)
        {
            try
            {
                Process[] procs = Process.GetProcessesByName(procName);
                foreach (var p in procs)
                {
                    try
                    {
                        p.CloseMainWindow();
                        if (!p.WaitForExit(1500))
                        {
                            p.Kill();
                            p.WaitForExit(2000);
                        }
                    }
                    catch { }
                }
            }
            catch { }
        }

        private byte[] CreateMiniAsar(string patcherPath)
        {
            string indexJs = "require(\"" + patcherPath.Replace("\\", "\\\\") + "\")";
            string pkgJson = "{\n\t\"name\": \"discord\",\n\t\"main\": \"index.js\"\n}";
            byte[] indexBytes = Encoding.UTF8.GetBytes(indexJs);
            byte[] pkgBytes = Encoding.UTF8.GetBytes(pkgJson);

            string headerJson = string.Format(
                "{{\"files\":{{\"index.js\":{{\"size\":{0},\"offset\":\"0\"}},\"package.json\":{{\"size\":{1},\"offset\":\"{0}\"}}}}}}",
                indexBytes.Length, pkgBytes.Length
            );
            byte[] jsonBytes = Encoding.UTF8.GetBytes(headerJson);
            int jsonLen = jsonBytes.Length;
            int pad = (4 - (jsonLen % 4)) % 4;

            int totalHeaderPayload = jsonLen + pad;
            int totalHeaderSize = 16 + totalHeaderPayload;

            byte[] asar = new byte[totalHeaderSize + indexBytes.Length + pkgBytes.Length];
            BitConverter.GetBytes(4).CopyTo(asar, 0);
            BitConverter.GetBytes(totalHeaderPayload + 8).CopyTo(asar, 4);
            BitConverter.GetBytes(totalHeaderPayload + 4).CopyTo(asar, 8);
            BitConverter.GetBytes(jsonLen).CopyTo(asar, 12);
            Array.Copy(jsonBytes, 0, asar, 16, jsonLen);
            Array.Copy(indexBytes, 0, asar, totalHeaderSize, indexBytes.Length);
            Array.Copy(pkgBytes, 0, asar, totalHeaderSize + indexBytes.Length, pkgBytes.Length);

            return asar;
        }

        private void ExtractZenCordPayload(string targetDistDir)
        {
            if (!Directory.Exists(targetDistDir))
                Directory.CreateDirectory(targetDistDir);

            Assembly asm = Assembly.GetExecutingAssembly();
            using (Stream stream = asm.GetManifestResourceStream("ZenCordPayload.zip"))
            {
                if (stream == null)
                    throw new Exception("ZenCordPayload.zip embedded resource not found!");

                using (ZipArchive archive = new ZipArchive(stream, ZipArchiveMode.Read))
                {
                    foreach (ZipArchiveEntry entry in archive.Entries)
                    {
                        string destinationPath = Path.Combine(targetDistDir, entry.FullName);
                        if (string.IsNullOrEmpty(entry.Name))
                        {
                            Directory.CreateDirectory(destinationPath);
                        }
                        else
                        {
                            string parent = Path.GetDirectoryName(destinationPath);
                            if (!Directory.Exists(parent))
                                Directory.CreateDirectory(parent);
                            entry.ExtractToFile(destinationPath, true);
                        }
                    }
                }
            }
        }

        private void DoInstall(bool isRepair)
        {
            if (installs.Count == 0 || selectedInstallIndex < 0 || selectedInstallIndex >= installs.Count)
            {
                MessageBox.Show(
                    isArabic ? "يرجى تحديد مسار تثبيت ديسكورد أولاً." : "Please select a Discord installation first.",
                    "ZenCord",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Warning
                );
                return;
            }

            DiscordInstallInfo target = installs[selectedInstallIndex];
            statusLabel.Text = isArabic ? "جاري إغلاق ديسكورد وتطبيق التعديل..." : "Closing Discord and applying patch...";
            Application.DoEvents();

            try
            {
                KillDiscordProcess(target.ProcessName);
                Thread.Sleep(500);

                string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                string zenCordDir = Path.Combine(appData, "ZenCord");
                string zenCordDist = Path.Combine(zenCordDir, "dist");
                ExtractZenCordPayload(zenCordDist);

                string patcherPath = Path.Combine(zenCordDist, "patcher.js");
                if (!File.Exists(patcherPath))
                    throw new Exception("Patcher file was not extracted: " + patcherPath);

                string resDir = target.ResourcesPath;
                string appAsar = Path.Combine(resDir, "app.asar");
                string backupAsar = Path.Combine(resDir, "_app.asar");

                if (!File.Exists(backupAsar))
                {
                    if (File.Exists(appAsar))
                    {
                        FileInfo fi = new FileInfo(appAsar);
                        if (fi.Length > 100000)
                        {
                            File.Copy(appAsar, backupAsar, true);
                        }
                    }
                }

                byte[] miniAsar = CreateMiniAsar(patcherPath);
                File.WriteAllBytes(appAsar, miniAsar);

                target.IsPatched = true;
                ScanDiscords();

                statusLabel.Text = isArabic ? "تم تثبيت ZenCord بنجاح!" : "ZenCord installed successfully!";
                string msg = isArabic
                    ? "تم تثبيت ZenCord بنجاح في ديسكورد!\nيمكنك الآن تشغيل ديسكورد والاستمتاع بكافة مميزات ZenCord."
                    : "ZenCord was successfully installed to Discord!\nYou can now launch Discord and enjoy all ZenCord features.";
                MessageBox.Show(msg, "ZenCord", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                statusLabel.Text = isArabic ? "حدث خطأ أثناء التثبيت." : "Error occurred during installation.";
                MessageBox.Show(
                    (isArabic ? "فشل التثبيت: " : "Installation failed: ") + ex.Message,
                    "ZenCord",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }

        private void DoUninstall()
        {
            if (installs.Count == 0 || selectedInstallIndex < 0 || selectedInstallIndex >= installs.Count)
            {
                MessageBox.Show(
                    isArabic ? "يرجى تحديد مسار ديسكورد أولاً." : "Please select a Discord installation first.",
                    "ZenCord",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Warning
                );
                return;
            }

            DiscordInstallInfo target = installs[selectedInstallIndex];
            statusLabel.Text = isArabic ? "جاري إزالة التعديل واستعادة النسخة الأصلية..." : "Unpatching and restoring original Discord...";
            Application.DoEvents();

            try
            {
                KillDiscordProcess(target.ProcessName);
                Thread.Sleep(500);

                string resDir = target.ResourcesPath;
                string appAsar = Path.Combine(resDir, "app.asar");
                string backupAsar = Path.Combine(resDir, "_app.asar");

                if (File.Exists(backupAsar))
                {
                    if (File.Exists(appAsar))
                        File.Delete(appAsar);
                    File.Move(backupAsar, appAsar);
                }
                else
                {
                    if (File.Exists(appAsar))
                    {
                        FileInfo fi = new FileInfo(appAsar);
                        if (fi.Length < 10000)
                        {
                            File.Delete(appAsar);
                        }
                    }
                }

                target.IsPatched = false;
                ScanDiscords();

                statusLabel.Text = isArabic ? "تم إلغاء التثبيت بنجاح." : "ZenCord uninstalled successfully.";
                string msg = isArabic
                    ? "تم إلغاء تثبيت ZenCord واستعادة ديسكورد إلى حالته الأصلية بنجاح."
                    : "ZenCord has been uninstalled and Discord has been restored to default.";
                MessageBox.Show(msg, "ZenCord", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                statusLabel.Text = isArabic ? "حدث خطأ أثناء إلغاء التثبيت." : "Error during uninstall.";
                MessageBox.Show(
                    (isArabic ? "فشل إلغاء التثبيت: " : "Uninstall failed: ") + ex.Message,
                    "ZenCord",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }

        private void DoInstallOpenAsar()
        {
            if (installs.Count == 0 || selectedInstallIndex < 0 || selectedInstallIndex >= installs.Count)
            {
                MessageBox.Show(
                    isArabic ? "يرجى تحديد مسار ديسكورد أولاً." : "Please select a Discord installation first.",
                    "ZenCord",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Warning
                );
                return;
            }

            DiscordInstallInfo target = installs[selectedInstallIndex];
            statusLabel.Text = isArabic ? "جاري تحميل OpenAsar..." : "Downloading OpenAsar...";
            Application.DoEvents();

            try
            {
                KillDiscordProcess(target.ProcessName);
                Thread.Sleep(500);

                string url = "https://github.com/GooseMod/OpenAsar/releases/latest/download/app.asar";
                string resDir = target.ResourcesPath;
                string destFile = target.IsPatched ? Path.Combine(resDir, "_app.asar") : Path.Combine(resDir, "app.asar");

                using (WebClient wc = new WebClient())
                {
                    wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
                    byte[] data = wc.DownloadData(url);
                    File.WriteAllBytes(destFile, data);
                }

                statusLabel.Text = isArabic ? "تم تثبيت OpenAsar بنجاح!" : "OpenAsar installed successfully!";
                string msg = isArabic
                    ? "تم تثبيت OpenAsar بنجاح لتسريع أداء ديسكورد!"
                    : "OpenAsar was successfully installed!";
                MessageBox.Show(msg, "ZenCord", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                statusLabel.Text = isArabic ? "فشل تحميل OpenAsar." : "Failed to download OpenAsar.";
                MessageBox.Show(
                    (isArabic ? "فشل تثبيت OpenAsar: " : "Failed to install OpenAsar: ") + ex.Message,
                    "ZenCord",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }
    }
}
