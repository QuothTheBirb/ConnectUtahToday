import * as migration_20260420_092710_initial from './20260420_092710_initial';

export const migrations = [
  {
    up: migration_20260420_092710_initial.up,
    down: migration_20260420_092710_initial.down,
    name: '20260420_092710_initial'
  },
];
