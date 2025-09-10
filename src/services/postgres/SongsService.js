const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { mapSongsToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAllSongs({ title, performer }) {
    const query = () => {
      if (title && performer) {
        return {
          text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
          values: [`%${title}%`, `%${performer}%`],
        };
      } if (title) {
        return {
          text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1',
          values: [`%${title}%`],
        };
      } if (performer) {
        return {
          text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1',
          values: [`%${performer}%`],
        };
      }
      return {
        text: 'SELECT id, title, performer FROM songs',
        values: [],
      };
    };
    const result = await this._pool.query(query());
    return result.rows.map(mapSongsToModel);
  }

  async getSongById({ id }) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapSongsToModel)[0];
  }

  async editSongById({
    id, title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById({ id }) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
