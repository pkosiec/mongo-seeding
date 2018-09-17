import { ObjectId } from 'mongodb';
import { createHash } from 'crypto';

export const mapToEntities = (names: string[]) => {
  return names.map(name => {
    const id = getObjectId(name);

    return {
      id,
      name,
    };
  });
};

export const getObjectId = (name: string): ObjectId => {
  const hash = createHash('sha1')
    .update(name, 'utf8')
    .digest('hex');

  return new ObjectId(hash.substring(0, 24));
};

export const getObjectIds = (names: string[]): ObjectId[] => {
  return names.map(name => getObjectId(name));
};
