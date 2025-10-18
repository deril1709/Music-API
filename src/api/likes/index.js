const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, { albumLikesService, albumsService }) => {
    const likesHandler = new LikesHandler(albumLikesService, albumsService);
    server.route(routes(likesHandler));
  },
};
