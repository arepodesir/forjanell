export function parseTOML(tomlStr: string): any {
  const result: any = {};
  let currentSection: any = result;
  const lines = tomlStr.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    // Skip comments and empty lines
    if (!line || line.startsWith('#') || line.startsWith(';')) {
      continue;
    }

    // Array of Tables: e.g. [[giftShelf]]
    if (line.startsWith('[[') && line.endsWith(']]')) {
      const listName = line.slice(2, -2).trim();
      if (!result[listName]) {
        result[listName] = [];
      }
      const newObj = {};
      result[listName].push(newObj);
      currentSection = newObj;
      continue;
    }

    // Section header: e.g. [cardMeta]
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionName = line.slice(1, -1).trim();
      if (sectionName.includes('.')) {
        const parts = sectionName.split('.');
        let temp = result;
        for (const part of parts) {
          if (!temp[part]) temp[part] = {};
          temp = temp[part];
        }
        currentSection = temp;
      } else {
        if (!result[sectionName]) result[sectionName] = {};
        currentSection = result[sectionName];
      }
      continue;
    }

    // Key-value pair: e.g. key = value
    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.substring(0, eqIdx).trim();
      const valStr = line.substring(eqIdx + 1).trim();

      let val: any = valStr;

      // Double-quoted strings
      if (valStr.startsWith('"') && valStr.endsWith('"')) {
        val = valStr.slice(1, -1).replace(/\\"/g, '"');
      }
      // Single-quoted strings
      else if (valStr.startsWith("'") && valStr.endsWith("'")) {
        val = valStr.slice(1, -1);
      }
      // Booleans
      else if (valStr === 'true') {
        val = true;
      } else if (valStr === 'false') {
        val = false;
      }
      // Numbers
      else if (!isNaN(Number(valStr))) {
        val = Number(valStr);
      }
      // Arrays: e.g. ["a", "b", "c"]
      else if (valStr.startsWith('[') && valStr.endsWith(']')) {
        const inner = valStr.slice(1, -1).trim();
        if (!inner) {
          val = [];
        } else {
          // split commas, clean quotes
          val = inner.split(',').map(item => {
            item = item.trim();
            if (item.startsWith('"') && item.endsWith('"')) {
              return item.slice(1, -1);
            }
            if (item.startsWith("'") && item.endsWith("'")) {
              return item.slice(1, -1);
            }
            return item;
          });
        }
      }
      // Inline tables: e.g. { emoji = "💡", label = "Switch On" }
      else if (valStr.startsWith('{') && valStr.endsWith('}')) {
        const inner = valStr.slice(1, -1).trim();
        const obj: any = {};
        if (inner) {
          const pairs = inner.split(',');
          for (const pair of pairs) {
            const splitChar = pair.includes('=') ? '=' : ':';
            const [k, v] = pair.split(splitChar).map(x => x.trim());
            let parsedV: any = v;
            if (v.startsWith('"') && v.endsWith('"')) {
              parsedV = v.slice(1, -1);
            } else if (v.startsWith("'") && v.endsWith("'")) {
              parsedV = v.slice(1, -1);
            }
            obj[k] = parsedV;
          }
        }
        val = obj;
      }

      currentSection[key] = val;
    }
  }

  return result;
}
