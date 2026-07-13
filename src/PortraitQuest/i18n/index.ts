import type { Locale } from '../types';

export function detectLocale(): Locale {
  try {
    const override = localStorage.getItem('game_locale');
    if (override === 'zh' || override === 'en') return override;
  } catch {
    // Storage can be unavailable in a restricted iframe.
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function formatName(template: string, username: string): string {
  return template.split('{name}').join(username);
}
