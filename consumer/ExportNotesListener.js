const ExportService = require('../src/services/rabbitmq/ExportService');
const PlaylistsService = require('../src/services/postgresql/PlaylistsService');
const MailSender = require('../src/services/mail/MailSender');

const listener = async (message) => {
  try {
    const { playlistId, targetEmail } = JSON.parse(message.content.toString());
    const playlistsService = new PlaylistsService();
    const mailSender = new MailSender();
    const exportService = new ExportService(playlistsService, mailSender);

    console.log(`Processing export for playlist ${playlistId}...`);
    await exportService.exportPlaylist(playlistId, targetEmail);
  } catch (error) {
    console.error('Export error:', error);
  }
};

module.exports = listener;
