import { parse } from 'smol-toml';

export function toml(input: string) {
  return  parse(input) 
}
