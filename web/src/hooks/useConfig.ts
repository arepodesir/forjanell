import { config, type WebConfig } from '@/config';

/**
 * useConfig
 * The primary client-side accessor for the TOML-first config system.
 * Follows the established pattern (alias imports, thin re-export for Solid components).
 *
 * Components (e.g. future use inside Hadacard or FrutigerScenes) can do:
 *   const cfg = useConfig();
 *   // cfg.recipient, cfg.scenes, cfg.gifts, cfg.computed.getAge() etc.
 */
export function useConfig(): WebConfig {
  return config;
}

export type { WebConfig };
export { config } from '@/config'; // also allow direct named import if preferred
