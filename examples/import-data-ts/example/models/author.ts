import { Column as Property } from 'typeorm';

export class Author {
  @Property() name: string;

  @Property() email?: string;
}
