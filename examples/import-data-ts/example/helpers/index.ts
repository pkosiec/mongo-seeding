import { getObjectId } from 'mongo-seeding';

export const mapToEntities = (names: string[]) => {
  return names.map((name) => {
    const id = getObjectId(name);

    return {
      id,
      name,
    };
  });
};
