#!/usr/bin/env bash
# ==============================================================================
# Weekly LLM Auto-Assessment Shell Runner
# AI Governance, Risk & Compliance (GRC) — C&A Portal Integration
# ==============================================================================
set -e

APP_URL="${1:-http://localhost:3000}"
OUTPUT_FILE="market-models-feed.json"

echo "===================================================================="
echo " Starting Weekly Continuous LLM Market Assessment Scanner..."
echo " Target C&A Portal API: ${APP_URL}"
echo "===================================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] python3 is required to run this scanner."
    exit 1
fi

SCRIPT_PATH="./weekly_llm_scanner.py"
if [ ! -f "$SCRIPT_PATH" ]; then
    SCRIPT_PATH="./scripts/weekly_llm_scanner.py"
fi

# Execute the assessment script and push to API
python3 "${SCRIPT_PATH}" --output "${OUTPUT_FILE}" --upload-to-app --app-url "${APP_URL}"

echo "===================================================================="
echo " [SUCCESS] Weekly scan completed and synchronized with C&A Portal!"
echo " Generated feed saved locally: ${OUTPUT_FILE}"
echo "===================================================================="
