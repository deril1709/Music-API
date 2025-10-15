class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongByPlaylistIdHandler = this.postPlaylistSongByPlaylistIdHandler.bind(this);
    this.getPlaylistSongsByPlaylistIdHandler = this.getPlaylistSongsByPlaylistIdHandler.bind(this);
    this.deletePlaylistSongByPlaylistIdHandler = this.deletePlaylistSongByPlaylistIdHandler.bind(this);
    this.getPlaylistActivitiesByPlaylistIdHandler = this.getPlaylistActivitiesByPlaylistIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayloadSchema(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner });

    const response = h.response({
      data: { playlistId },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(owner);
    return {
      data: { playlists },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, owner);
    await this._service.deletePlaylist({ playlistId });
    return {
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongByPlaylistIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, owner);
    this._validator.validatePostPlaylistSongPayloadSchema(request.payload);
    const { songId } = request.payload;
    await this._service.addSongToPlaylist({ playlistId, songId });
    await this._service.addPlaylistActivities({
      playlistId,
      songId,
      userId: owner,
      action: 'add',
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsByPlaylistIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, owner);
    const { playlist } = await this._service.getPlaylistSongs({ playlistId });
    return {
      data: { playlist },
    };
  }

  async deletePlaylistSongByPlaylistIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, owner);
    const { songId } = request.payload;
    await this._service.deletePlaylistSong({ playlistId, songId });
    await this._service.addPlaylistActivities({
      playlistId,
      songId,
      userId: owner,
      action: 'delete',
    });
    return {
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesByPlaylistIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, owner);
    const playlistActivities = await this._service.getPlaylistActivities({ playlistId });
    return {
      data: {
        playlistId,
        activities: playlistActivities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
