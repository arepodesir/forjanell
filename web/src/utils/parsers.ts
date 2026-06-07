import { parse } from 'smol-toml';

export function parseTOML(tomlStr: string): any {
  return parse(tomlStr);
}
