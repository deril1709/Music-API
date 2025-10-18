const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postLikeHandler,
    options: { auth: 'notesapp_jwt' },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getLikesHandler,
  },
];

module.exports = routes;
