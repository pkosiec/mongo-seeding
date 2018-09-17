import { Category } from '../../models';
import { getObjectId } from '../../helpers/index';

const name = 'Additional Category';

const category: Category = {
  id: getObjectId(name),
  name,
};

export = category;
