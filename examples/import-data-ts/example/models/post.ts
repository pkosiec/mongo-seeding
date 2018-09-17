import {
  Column as Property,
  Entity as Collection,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { Author, Comment } from '../models/index';

@Collection('posts')
export class Post {
  @ObjectIdColumn() readonly id: ObjectId;

  @Property() title: string;

  @Property() description: string;

  @Property() tags: string[];

  @Property() author: Author;

  @Property() comments: Comment[];

  @Property() creationDate: Date;
}
