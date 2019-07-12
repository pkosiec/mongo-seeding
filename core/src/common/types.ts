/**
 * Defines a recursive partial object
 */
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Defines a collection for seeding database.
 */
export interface SeederCollection {
  name: string;
  documents: object[];
}
