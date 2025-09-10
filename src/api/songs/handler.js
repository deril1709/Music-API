class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async getAllSongsHandler(request) {
    const { query } = request;
    const result = await this._service.getAllSongs(query);
    return {
      status: 'success',
      data: {
        songs: result,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { params } = request;
    const result = await this._service.getSongById(params);
    return {
      status: 'success',
      data: {
        song: result,
      },
    };
  }

  async postSongHandler(request, h) {
    const { payload } = request;
    this._validator.validateSongPayload(payload);
    const result = await this._service.addSong(payload);
    const response = h.response({
      status: 'success',
      data: {
        songId: result,
      },
    });
    response.code(201);
    return response;
  }

  async putSongByIdHandler(request) {
    const { payload } = request;
    const { id } = request.params;

    this._validator.validateSongPayload(payload);
    await this._service.editSongById({ id, ...payload });

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
      data: {
        songId: id,
      },
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteSongById({ id });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
      data: {
        songId: id,
      },
    };
  }
}

module.exports = SongsHandler;
