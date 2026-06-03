import { parse } from 'smol-toml';

/**
 * Parses raw TOML string using the third-party 'smol-toml' library.
 */
export function parseTOML(tomlStr: string): any {
  return parse(tomlStr);
}
