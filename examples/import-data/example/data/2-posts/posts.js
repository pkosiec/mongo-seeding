const { getObjectId } = require('../../helpers/index');

const posts = [
  {
    id: getObjectId('post1'),
    title: 'Lorem ipsum',
    description: 'Sample Post 1 description',
    tags: ['sample', 'tags'],
    author: {
      name: 'Author',
      email: 'test@example.com',
    },
    comments: [],
    creationDate: new Date(),
  },
  {
    id: getObjectId('post2'),
    title: 'Dolor sit amet',
    description: 'Sample Post 2 description',
    tags: ['example', 'sample', 'tag'],
    author: {
      name: 'Author2',
      email: 'test2@example.com',
    },
    comments: [
      {
        nickname: 'Anonymous',
        content: 'Great article!',
        creationDate: new Date(),
      },
      {
        nickname: 'John F',
        content: 'Awesome!',
        creationDate: new Date(),
      },
    ],
    creationDate: new Date(),
  },
];

module.exports = posts;
