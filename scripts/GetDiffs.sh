#!/bin/sh

set -x # verbose mode
set -e # stop executing after error

diff="$(diff --new-file --unified=0 base/base.ttl rdfs/output.ttl || true)" # 'or true' because a non-identical diff outputs 1 as the exit status

cat "$diff"

cat > diff.md << EOS
\`\`\`diff
$diff
\`\`\`
EOS