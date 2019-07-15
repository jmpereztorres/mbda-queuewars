#!/bin/bash
set -eou pipefail
python3 -m venv .direnv
source .direnv/bin/activate
pip3 install -r requirements.txt

