const { Pool } = require('pg');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addUserLike(albumId, userId) {
    const id = `likes-${Date.now()}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3)',
      values: [id, userId, albumId],
    };
    await this._pool.query(query);
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async deleteUserLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    await this._pool.query(query);
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async checkUserLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      return { likes: JSON.parse(result), cache: true };
    } catch {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].count, 10);
      await this._cacheService.set(`album-likes:${albumId}`, JSON.stringify(likes));
      return { likes, cache: false };
    }
  }
}

module.exports = AlbumLikesService;
