require('dotenv').config();
const amqp = require('amqplib');
const ExportNotesListener = require('./consumer/ExportNotesListener');

const init = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
  const queue = 'export:playlists';

  await channel.assertQueue(queue, { durable: true });

  console.log(`Listening for messages on queue: ${queue}`);
  channel.consume(queue, ExportNotesListener, { noAck: true });
};

init();
