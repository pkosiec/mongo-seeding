import { ObjectId } from 'mongodb';
import { createHash } from 'crypto';

/**
 * Constructs an ObjectId instance based on entity name.
 * Helpful for database references between two collections.
 *
 * @param name Entity name
 */
export const getObjectId = (name: string): ObjectId => {
  if (name === '') {
    throw new Error('Name cannot be empty');
  }

  const hash = createHash('sha1').update(name, 'utf8').digest('hex');

  return new ObjectId(hash.substring(0, 24));
};

/**
 * Constructs ObjectId instances based on entity names.
 * Helpful for database references between two collections.
 *
 * @param names Array of object names
 */
export const getObjectIds = (names: string[]): ObjectId[] => {
  return names.map((name) => getObjectId(name));
};
