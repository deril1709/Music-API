class LikesHandler {
  constructor(albumLikesService, albumsService) {
    this._albumLikesService = albumLikesService;
    this._albumsService = albumsService;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);

    const isLiked = await this._albumLikesService.checkUserLike(albumId, userId);
    if (isLiked) {
      await this._albumLikesService.deleteUserLike(albumId, userId);
      return { status: 'success', message: 'Album batal disukai' };
    }

    await this._albumLikesService.addUserLike(albumId, userId);
    const response = h.response({
      status: 'success',
      message: 'Album disukai',
    });
    response.code(201);
    return response;
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, cache } = await this._albumLikesService.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: { likes },
    });

    if (cache) response.header('X-Data-Source', 'cache');
    return response;
  }
}

module.exports = LikesHandler;
