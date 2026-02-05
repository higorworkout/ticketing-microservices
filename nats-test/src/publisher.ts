import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publish';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
    console.log('Ticket created event published successfully');
  } catch (err) {
    console.error('Error publishing ticket created event:', err);
  }

/*  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  }); 

  stan.publish('ticket:created', data, (err, gid) => {
    if (err) {
      console.error('Erro ao publicar:', err);
    } else {
      console.log('Mensagem publicada com id:', gid); 
    }
  });*/
  
});

