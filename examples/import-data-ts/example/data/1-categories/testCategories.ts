import { Category } from '../../models';
import { getObjectId } from 'mongo-seeding';

const categories: Category[] = [
  {
    id: getObjectId('test1'),
    name: 'Test Category 1',
  },
  {
    id: getObjectId('test2'),
    name: 'Test Category 2',
  },
];

export = categories;
