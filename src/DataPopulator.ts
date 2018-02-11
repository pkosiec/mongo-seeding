export interface Collection {
  name: string;
  documents: string[];
}

export class DataPopulator {
  populate(dataPath: string): Collection[] {
    return [];
  }
}
