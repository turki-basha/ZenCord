#!/usr/bin/env bash
# ==============================================================================
# ZenCord Universal Installer for Linux & macOS
# Usage: sh -c "$(curl -sS https://raw.githubusercontent.com/turki-basha/ZenCord/main/scripts/install.sh)"
# ==============================================================================

set -e

# Terminal colors
BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
NC='\033[0m' # No Color

print_banner() {
    clear 2>/dev/null || true
    echo -e "${CYAN}${BOLD}"
    cat << "EOF"
  ______            _____              _ 
 |___  /           / ____|            | |
    / / ___ _ __  | |     ___  _ __ __| |
   / / / _ \ '_ \ | |    / _ \| '__/ _` |
  / /_|  __/ | | || |___| (_) | | | (_| |
 /_____\___|_| |_| \_____\___/|_|  \__,_|
                                         
   ZenCord Discord Client Mod - Universal Installer
EOF
    echo -e "${NC}"
}

print_banner

OS_NAME="$(uname -s)"
case "${OS_NAME}" in
    Linux*)     OS="linux";;
    Darwin*)    OS="mac";;
    *)          OS="unknown";;
esac

if [ "$OS" = "unknown" ]; then
    echo -e "${RED}[!] Unsupported operating system: ${OS_NAME}${NC}"
    exit 1
fi

echo -e "${CYAN}[*] Detected operating system: ${BOLD}${OS_NAME}${NC}"

# Determine ZenCord directory
if [ "$OS" = "mac" ]; then
    ZENCORD_DIR="$HOME/Library/Application Support/ZenCord"
else
    ZENCORD_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/ZenCord"
fi

ZENCORD_DIST="$ZENCORD_DIR/dist"
mkdir -p "$ZENCORD_DIST"

echo -e "${CYAN}[*] Target ZenCord directory: ${BOLD}${ZENCORD_DIST}${NC}"

# Find Discord installations
find_discords() {
    DISCORD_PATHS=()

    if [ "$OS" = "mac" ]; then
        POSSIBLE_APPS=(
            "/Applications/Discord.app"
            "/Applications/Discord PTB.app"
            "/Applications/Discord Canary.app"
            "/Applications/Discord Development.app"
            "$HOME/Applications/Discord.app"
            "$HOME/Applications/Discord PTB.app"
            "$HOME/Applications/Discord Canary.app"
        )
        for app in "${POSSIBLE_APPS[@]}"; do
            if [ -d "$app/Contents/Resources" ]; then
                DISCORD_PATHS+=("$app/Contents/Resources")
            fi
        done
    else
        # Linux standard paths
        POSSIBLE_PATHS=(
            "/usr/share/discord/resources"
            "/usr/lib/discord/resources"
            "/opt/discord/resources"
            "/usr/share/discord-canary/resources"
            "/usr/share/discord-ptb/resources"
            "/opt/discord-canary/resources"
            "/opt/discord-ptb/resources"
            "$HOME/.local/share/discord/resources"
            # Flatpak paths
            "$HOME/.var/app/com.discordapp.Discord/config/discord"
            "/var/lib/flatpak/app/com.discordapp.Discord/current/active/files/discord/resources"
        )
        for path in "${POSSIBLE_PATHS[@]}"; do
            if [ -d "$path" ]; then
                DISCORD_PATHS+=("$path")
            fi
        done
    fi
}

find_discords

if [ ${#DISCORD_PATHS[@]} -eq 0 ]; then
    echo -e "${YELLOW}[?] No standard Discord directory auto-detected.${NC}"
    echo -e "Please enter the full path to your Discord 'resources' directory:"
    read -r MANUAL_PATH
    if [ -d "$MANUAL_PATH" ]; then
        DISCORD_PATHS+=("$MANUAL_PATH")
    else
        echo -e "${RED}[!] Invalid directory. Exiting.${NC}"
        exit 1
    fi
fi

# Select install
SELECTED_DIR="${DISCORD_PATHS[0]}"
if [ ${#DISCORD_PATHS[@]} -gt 1 ]; then
    echo -e "\n${CYAN}Multiple Discord installations detected:${NC}"
    for i in "${!DISCORD_PATHS[@]}"; do
        echo -e "  [$((i + 1))] ${DISCORD_PATHS[$i]}"
    done
    printf "\nSelect installation [1-${#DISCORD_PATHS[@]}]: "
    read -r CHOICE
    INDEX=$((CHOICE - 1))
    if [ -n "${DISCORD_PATHS[$INDEX]}" ]; then
        SELECTED_DIR="${DISCORD_PATHS[$INDEX]}"
    fi
fi

echo -e "\n${CYAN}[*] Selected Discord path: ${BOLD}${SELECTED_DIR}${NC}"

# Download latest ZenCord files
echo -e "\n${CYAN}[*] Downloading latest ZenCord files from GitHub...${NC}"
GITHUB_BASE="https://github.com/turki-basha/ZenCord/releases/latest/download"

FILES=(
    "patcher.js"
    "preload.js"
    "renderer.js"
    "renderer.css"
    "plugins.json"
)

for file in "${FILES[@]}"; do
    echo -e "  • Fetching ${file}..."
    curl -sSL --fail "${GITHUB_BASE}/${file}" -o "${ZENCORD_DIST}/${file}" || {
        echo -e "${RED}[!] Failed to download ${file}. Make sure your internet connection is active.${NC}"
        exit 1
    }
done

echo -e "${GREEN}[+] ZenCord files downloaded successfully.${NC}"

# Patching
echo -e "\n${CYAN}[*] Applying ZenCord patch to Discord...${NC}"

# Quit Discord if running
if [ "$OS" = "mac" ]; then
    osascript -e 'quit app "Discord"' 2>/dev/null || true
else
    pkill -f discord 2>/dev/null || true
fi
sleep 1

# If resources directory doesn't have app.asar, check parent or subfolder
APP_ASAR="${SELECTED_DIR}/app.asar"
BACKUP_ASAR="${SELECTED_DIR}/_app.asar"
APP_DIR="${SELECTED_DIR}/app"

if [ ! -f "$APP_ASAR" ] && [ -f "$BACKUP_ASAR" ]; then
    echo -e "  • Previous patch detected. Updating..."
elif [ -f "$APP_ASAR" ] && [ ! -f "$BACKUP_ASAR" ]; then
    echo -e "  • Backing up original app.asar to _app.asar..."
    cp "$APP_ASAR" "$BACKUP_ASAR" 2>/dev/null || sudo cp "$APP_ASAR" "$BACKUP_ASAR"
fi

# Inject loader via resources/app directory (100% reliable across all electron versions)
mkdir -p "$APP_DIR" 2>/dev/null || sudo mkdir -p "$APP_DIR"

LOADER_INDEX="${APP_DIR}/index.js"
LOADER_PKG="${APP_DIR}/package.json"

cat << EOF | (cat > "$LOADER_INDEX" 2>/dev/null || sudo tee "$LOADER_INDEX" > /dev/null)
// ZenCord Electron Loader
require("${ZENCORD_DIST}/patcher.js");
EOF

cat << EOF | (cat > "$LOADER_PKG" 2>/dev/null || sudo tee "$LOADER_PKG" > /dev/null)
{
  "name": "discord",
  "main": "index.js"
}
EOF

echo -e "\n${GREEN}${BOLD}====================================================${NC}"
echo -e "${GREEN}${BOLD}      ZenCord Installed Successfully! Enjoy! 🚀    ${NC}"
echo -e "${GREEN}${BOLD}====================================================${NC}"
echo -e "\nPlease restart Discord now to start using ZenCord."
echo -e "All future updates will be applied automatically in the background!\n"
