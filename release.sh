#!/bin/bash
set -eou pipefail
readonly COMMIT=`git log --pretty=format:'%h' -n 1`
readonly PKG=queuewars-kafka-$COMMIT.tar
git archive --format=tar HEAD -o $PKG .
gzip -9 $PKG

