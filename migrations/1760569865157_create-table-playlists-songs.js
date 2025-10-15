export const up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar(50)',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
    },
    song_id: {
      type: 'varchar(50)',
      references: 'songs(id)',
      onDelete: 'CASCADE',
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('playlist_songs');
};