import { Publisher, Subjects, OrderCreatedEvent } from '@higorticketing/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}


