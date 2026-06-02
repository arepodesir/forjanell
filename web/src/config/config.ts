import tomlRaw from './config.toml?raw';
import { parseTOML } from './parser';

// Parse raw TOML file at build-time or runtime
const parsedConfig = parseTOML(tomlRaw);

// Computed configuration properties (intrinsic to the application)
const computedConfig = {
  // Check if birthday is today (May 2nd)
  isBirthdayToday: (): boolean => {
    const today = new Date();
    return today.getMonth() === 4 && today.getDate() === 2; // 0-indexed month: 4 is May
  },
  
  // Calculate current age based on birthDate
  getAge: (): number => {
    if (!parsedConfig.birthDate) return 33; // Default fallback
    const birth = new Date(parsedConfig.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
};

// Merge static TOML configuration with computed/functional properties
export const APP_CONFIG = {
  ...parsedConfig,
  computed: computedConfig
};
