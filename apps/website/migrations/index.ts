import * as migration_20260420_092710_initial from './20260420_092710_initial';
import * as migration_20260522_231725 from './20260522_231725';
import * as migration_20260530_185231 from './20260530_185231';
import * as migration_20260611_141724 from './20260611_141724';

export const migrations = [
  {
    up: migration_20260420_092710_initial.up,
    down: migration_20260420_092710_initial.down,
    name: '20260420_092710_initial',
  },
  {
    up: migration_20260522_231725.up,
    down: migration_20260522_231725.down,
    name: '20260522_231725',
  },
  {
    up: migration_20260530_185231.up,
    down: migration_20260530_185231.down,
    name: '20260530_185231',
  },
  {
    up: migration_20260611_141724.up,
    down: migration_20260611_141724.down,
    name: '20260611_141724'
  },
];
