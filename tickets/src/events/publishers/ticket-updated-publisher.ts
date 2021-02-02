import { Publisher, Subjects, TicketUpdatedEvent} from '@pxqticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

