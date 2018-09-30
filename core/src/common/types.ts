export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export interface SeederCollection {
  name: string;
  documents: object[];
}
