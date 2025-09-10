const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { mapAlbumToModel, mapSongsToModel } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums (id, name, year) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    console.log('==== [Service] Data diterima ====');
    console.log('ID:', id, '| Name:', name, '| Year:', year);
    console.log('==== [Service] Query values ====');
    console.log(query.values);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById({ id }) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const songsQuery = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };

    const songs_result = await this._pool.query(songsQuery);
    result.rows[0].songs = songs_result.rows.map(mapSongsToModel);

    return result.rows.map(mapAlbumToModel)[0];
  }

  async editAlbumById({ id, name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }

    return 'Album berhasil diperbarui';
  }

  async deleteAlbumById({ id }) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

    return 'Album berhasil dihapus';
  }
}

module.exports = AlbumsService;
