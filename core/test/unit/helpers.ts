import { getObjectId, getObjectIds } from '../../src';
import { ObjectId } from 'mongodb';

describe('getObjectId helper', () => {
  it('should return predictable ObjectId instance', () => {
    const name = 'test';
    const nameObjectId = getObjectId(name);
    expect(nameObjectId).toBeInstanceOf(ObjectId);

    for (let i = 0; i < 3; i++) {
      const objId = getObjectId(name);
      expect(objId).toEqual(nameObjectId);
      expect(objId).toBeInstanceOf(ObjectId);
    }
  });

  it("shouldn't accept empty strings", () => {
    expect(() => {
      getObjectId('');
    }).toThrowError('Name cannot be empty');
  });
});

describe('getObjectIds helper', () => {
  it('should return multiple predictable ObjectId instances', () => {
    const names = ['Test', 'foo', 'bar'];
    const objIds = getObjectIds(names);

    objIds.forEach((objId) => {
      expect(objId).toBeInstanceOf(ObjectId);
    });
  });
});
