// A span-based reader implementing the contest's broken-CSV policy.
export function run(input) {
  const source = String(input.text);
  const header = input.header === true;
  const stop = source.length;
  const rows = [];
  const errors = [];
  let columns = null, width = 0, line = 1;
  let index = source.charCodeAt(0) === 0xfeff ? 1 : 0;
  const quotedText = /["\r\n]/g;

  while (index < stop) {
    const startCode = source.charCodeAt(index);
    if (startCode === 10 || (startCode === 13 && source.charCodeAt(index + 1) === 10)) {
      index += startCode === 13 ? 2 : 1;
      ++line;
      continue;
    }

    const recordLine = line;
    const row = header && columns === null ? null : rows.length;
    const fields = [];
    let separator, wasQuoted;
    do {
      let value = '';
      let junkAfterQuote = false;
      let from = index;
      wasQuoted = source.charCodeAt(index) === 34;

      if (wasQuoted) {
        let scan = index + 1, span = scan, quotedBreaks = 0, terminated = false;
        while (scan < stop) {
          quotedText.lastIndex = scan;
          const hit = quotedText.exec(source);
          if (!hit) break;
          const mark = hit.index;
          const code = source.charCodeAt(mark);
          const following = source.charCodeAt(mark + 1);
          if (code === 34 && following !== 34) {
            value += source.slice(span, mark);
            from = mark + 1;
            line += quotedBreaks;
            junkAfterQuote = true;
            terminated = true;
            break;
          }
          if (code === 10) {
            ++quotedBreaks;
            scan = mark + 1;
            continue;
          }
          if (code === 13) ++quotedBreaks;
          value += source.slice(span, mark) + (code === 34 ? '"' : '\n');
          span = scan = mark + (code === 13 && following !== 10 ? 1 : 2);
        }
        if (!terminated) {
          value = '';
          errors.push({ code: 'unterminated_quote', line: recordLine, row });
        }
      }

      let kept = false;
      let span = from;
      for (;;) {
        let mark = span, ch = -1;
        for (; mark < stop; ++mark) {
          ch = source.charCodeAt(mark);
          if (ch === 44 || ch === 10 || ch === 13) break;
        }
        if (mark !== span) {
          kept = true;
          value += source.slice(span, mark);
        }
        separator = mark < stop ? ch : -1;
        if (separator === 13 && source.charCodeAt(mark + 1) !== 10) {
          errors.push({ code: 'stray_cr', line: recordLine, row });
          span = mark + 1;
          continue;
        }
        index = mark + (separator === 13 ? 2 : separator !== -1 ? 1 : 0);
        if (separator === 10 || separator === 13) ++line;
        break;
      }
      if (junkAfterQuote && kept) errors.push({ code: 'quote_junk', line: recordLine, row });
      fields.push(value);
    } while (separator === 44);

    if (fields.length === 1 && fields[0] === '' && !wasQuoted) continue;
    if (width === 0) width = fields.length;
    if (row === null) {
      columns = fields;
      continue;
    }
    if (fields.length < width) {
      const count = fields.length;
      errors.push({ code: 'short_row', line: recordLine, row, fields: count });
      for (let i = count; i < width; ++i) fields.push('');
    } else if (fields.length > width) {
      const extra = fields.slice(width);
      fields.length = width;
      errors.push({ code: 'long_row', line: recordLine, row, extra });
    }
    rows.push(fields);
  }
  return { columns: header ? (columns ?? []) : null, rows, errors };
}
