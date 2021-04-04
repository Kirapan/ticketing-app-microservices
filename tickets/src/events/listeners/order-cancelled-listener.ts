import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@pxqticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // find the ticket that the order is cancelling
        const ticket =  await Ticket.findById(data.ticket.id);
        // if no ticket, throw error
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        // mark the ticket as being unlocked by setting its orderId
        ticket.set({ orderId: undefined });
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        // ack the message
        msg.ack();
    }

}