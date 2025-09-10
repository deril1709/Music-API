const mapSongsToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapAlbumToModel = ({
  id,
  name,
  year,
  songs,
}) => ({
  id,
  name,
  year,
  songs: songs.map(mapSongsToModel),
});

module.exports = { mapSongsToModel, mapAlbumToModel };
