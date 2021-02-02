import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPubliser } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPubliser(stan);
    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20,
            userId: 'id'
        });
    } catch (e) {
        console.error(e)
    }
});