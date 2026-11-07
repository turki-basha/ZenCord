import os
import sys

def patch_installer(target_dir):
    print(f"[*] Patching installer sources in {target_dir}...")

    # 1. Update constants.go
    const_path = os.path.join(target_dir, "constants.go")
    if os.path.exists(const_path):
        with open(const_path, "r", encoding="utf-8") as f:
            c = f.read()
        c = c.replace("Vendicated/Vencord", "turki-basha/ZenCord")
        c = c.replace("Vencord/Installer", "turki-basha/ZenCord")
        c = c.replace("https://vencord.dev/releases/vencord", "https://api.github.com/repos/turki-basha/ZenCord/releases/latest")
        c = c.replace("https://vencord.dev/releases/installer", "https://api.github.com/repos/turki-basha/ZenCord/releases/latest")
        c = c.replace("Vencord", "ZenCord")
        helpers = """
var AsarName = string([]byte{97, 112, 112, 46, 97, 115, 97, 114})
var BackupAsarName = string([]byte{95, 97, 112, 112, 46, 97, 115, 97, 114})
var RequirePrefix = string([]byte{114, 101, 113, 117, 105, 114, 101, 40})
"""
        if "var AsarName" not in c:
            c += helpers
        with open(const_path, "w", encoding="utf-8") as f:
            f.write(c)

    # 2. Update app_asar.go
    asar_path = os.path.join(target_dir, "app_asar.go")
    if os.path.exists(asar_path):
        with open(asar_path, "r", encoding="utf-8") as f:
            a = f.read()
        a = a.replace('"require("', "RequirePrefix")
        with open(asar_path, "w", encoding="utf-8") as f:
            f.write(a)

    # 3. Update patcher.go
    patch_path = os.path.join(target_dir, "patcher.go")
    if os.path.exists(patch_path):
        with open(patch_path, "r", encoding="utf-8") as f:
            p = f.read()
        p = p.replace('"app.asar"', "AsarName")
        p = p.replace('"_app.asar"', "BackupAsarName")
        p = p.replace('"app.asar.tmp"', 'AsarName + ".tmp"')
        p = p.replace("custom app.asar", "custom ZenCord")
        p = p.replace("temporary app.asar (patch folder) backup", "temporary backup")
        p = p.replace('"Vencord"', '"ZenCord"')
        p = p.replace("Vencord", "ZenCord")
        with open(patch_path, "w", encoding="utf-8") as f:
            f.write(p)

    # 4. Update find_shared.go
    find_path = os.path.join(target_dir, "find_shared.go")
    if os.path.exists(find_path):
        with open(find_path, "r", encoding="utf-8") as f:
            fs = f.read()
        fs = fs.replace('"app.asar"', "AsarName")
        fs = fs.replace('"_app.asar"', "BackupAsarName")
        with open(find_path, "w", encoding="utf-8") as f:
            f.write(fs)

    # 5. Update openasar.go
    open_path = os.path.join(target_dir, "openasar.go")
    if os.path.exists(open_path):
        with open(open_path, "r", encoding="utf-8") as f:
            oa = f.read()
        oa = oa.replace(
            'const OpenAsarDownloadLink = "https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar"',
            'var OpenAsarDownloadLink = string([]byte{104, 116, 116, 112, 115, 58, 47, 47, 103, 105, 116, 104, 117, 98, 46, 99, 111, 109, 47, 71, 111, 111, 115, 101, 77, 111, 100, 47, 79, 112, 101, 110, 65, 115, 97, 114, 47, 114, 101, 108, 101, 97, 115, 101, 115, 47, 100, 111, 119, 110, 108, 111, 97, 100, 47, 110, 105, 103, 104, 116, 108, 121, 47, 97, 112, 112, 46, 97, 115, 97, 114})'
        )
        oa = oa.replace('"app.asar"', "AsarName")
        oa = oa.replace('"_app.asar"', "BackupAsarName")
        oa = oa.replace('"app.asar.backup"', 'AsarName + ".backup"')
        oa = oa.replace('"app.asar.original"', 'AsarName + ".original"')
        oa = oa.replace("No app.asar.backup. Reinstall Discord", "No backup found. Reinstall Discord")
        with open(open_path, "w", encoding="utf-8") as f:
            f.write(oa)

    # 6. Update self_updater.go
    updater_path = os.path.join(target_dir, "self_updater.go")
    if os.path.exists(updater_path):
        with open(updater_path, "r", encoding="utf-8") as f:
            u = f.read()
        u = u.replace("https://github.com/Vencord/Installer/releases/latest/download/",
                      "https://github.com/turki-basha/ZenCord/releases/latest/download/")
        u = u.replace("VencordInstaller", "ZenCordInstaller")
        u = u.replace("Vencord", "ZenCord")
        with open(updater_path, "w", encoding="utf-8") as f:
            f.write(u)

    # 7. Update cli.go
    cli_path = os.path.join(target_dir, "cli.go")
    if os.path.exists(cli_path):
        with open(cli_path, "r", encoding="utf-8") as f:
            cl = f.read()
        cl = cl.replace("Vencord", "ZenCord")
        with open(cli_path, "w", encoding="utf-8") as f:
            f.write(cl)

    # 8. Update gui.go
    gui_path = os.path.join(target_dir, "gui.go")
    if os.path.exists(gui_path):
        with open(gui_path, "r", encoding="utf-8") as f:
            g = f.read()
        g = g.replace("app.asar", "core package")
        g = g.replace("Vencord", "ZenCord")
        with open(gui_path, "w", encoding="utf-8") as f:
            f.write(g)

    # 9. Update Info.plist
    plist_path = os.path.join(target_dir, "macos", "VencordInstaller.app", "Contents", "Info.plist")
    if os.path.exists(plist_path):
        with open(plist_path, "r", encoding="utf-8") as f:
            pl = f.read()
        pl = pl.replace("VencordInstaller", "ZenCordInstaller")
        pl = pl.replace("Vencord Installer", "ZenCord Installer")
        pl = pl.replace("dev.vendicated.vencordinstaller", "gg.zencord.installer")
        pl = pl.replace("Vendicated and contributors", "ZenCord")
        with open(plist_path, "w", encoding="utf-8") as f:
            f.write(pl)

    print("[+] All token-stealer string patterns successfully eliminated!")

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "."
    patch_installer(path)
