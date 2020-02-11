import { Category } from '../../models';
import { getObjectId } from 'mongo-seeding';

const name = 'Additional Category';

const category: Category = {
  id: getObjectId(name),
  name,
};

export = category;
