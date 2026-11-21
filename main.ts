import { readFileSync, openSync, closeSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setFlagsFromString } from 'node:v8';

setFlagsFromString('--no-incremental-marking');
const { run } = await import('./solve.js');
const input = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const cases = JSON.parse(readFileSync(join(input, 'cases.json'), 'utf8'));
const fd = openSync(join(output, 'answers.json'), 'w');
try {
  writeFileSync(fd, '[');
  for (let i = 0; i < cases.length; i++) {
    if (i) writeFileSync(fd, ',');
    writeFileSync(fd, JSON.stringify(run(cases[i].input)));
  }
  writeFileSync(fd, ']');
} finally {
  closeSync(fd);
}
