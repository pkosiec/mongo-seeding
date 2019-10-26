/**
 * Defines a recursive partial object
 */
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Defines a collection for seeding database.
 */
export interface SeederCollection extends SeederCollectionMetadata {
  documents: object[];
}

export interface SeederCollectionMetadata {
  name: string;
  orderNo?: number;
}
