import { Column as Property } from 'typeorm';
import { ObjectId } from 'mongodb';

export class Comment {
  @Property() nickname: string;

  @Property() content: string;

  @Property() creationDate: Date;
}
