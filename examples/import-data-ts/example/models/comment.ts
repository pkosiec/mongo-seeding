import { Column as Property } from 'typeorm';

export class Comment {
  @Property() nickname: string;

  @Property() content: string;

  @Property() creationDate: Date;
}
