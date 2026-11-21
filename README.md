# CSV Span Reader

[![make.fun · CSV reader speed challenge](https://make.fun/badge/csv-reader-speed-01-run-20261121.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121)
[![Rank](https://make.fun/badge/csv-reader-speed-01-run-20261121/BearSama1/makefun-csv-span-reader/rank.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121/leaderboard)
[![Reward](https://make.fun/badge/csv-reader-speed-01-run-20261121/BearSama1/makefun-csv-span-reader/reward.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121)

An original, dependency-free JavaScript parser for the contest's broken CSV
policy. It copies ordinary text in spans, handles quoted fields and unusual
line endings, and preserves the reference's ordered error records. Each call
is independent.

## Run it

Use Node.js 22.18 or later. The driver reads `/input/cases.json` and writes
`/output/answers.json`. To run outside the contest sandbox:

```sh
mkdir -p ./output
MAKEFUN_INPUT_DIR=./input MAKEFUN_OUTPUT_DIR=./output node main.ts
```

`input/cases.json` is an array of `{"id":"example","input":{"text":"a,b\n1,2","header":true}}`
objects. The resulting JSON array contains one answer per input, in order.
