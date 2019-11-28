#!/bin/sh

set -x # verbose mode
set -e # stop executing after error

diff="$(diff --recursive --new-file --unified=0 /tmp/old /tmp/new || true)" # 'or true' because a non-identical diff outputs 1 as the exit status

cat $diff

cat > diff.md << EOS
\`\`\`diff
$diff
\`\`\`
EOS