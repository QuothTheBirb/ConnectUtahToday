import * as migration_20260420_092710_initial from './20260420_092710_initial';
import * as migration_20260522_231725 from './20260522_231725';

export const migrations = [
  {
    up: migration_20260420_092710_initial.up,
    down: migration_20260420_092710_initial.down,
    name: '20260420_092710_initial',
  },
  {
    up: migration_20260522_231725.up,
    down: migration_20260522_231725.down,
    name: '20260522_231725'
  },
];
