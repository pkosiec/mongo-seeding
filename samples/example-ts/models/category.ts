import {
  Column as Property,
  Entity as Collection,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Collection('categories')
export class Category {
  @ObjectIdColumn() readonly id: ObjectId;

  @Property() name: string;
}
