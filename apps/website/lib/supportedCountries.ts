export const SUPPORTED_COUNTRIES = [
  { label: 'United States of America', value: 'US' },
] as const;

export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number]['value'];
