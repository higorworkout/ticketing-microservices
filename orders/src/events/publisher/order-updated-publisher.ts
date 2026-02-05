import { Publisher, Subjects, OrderCancelledEvent } from '@higorticketing/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled
 = Subjects.OrderCancelled;
}