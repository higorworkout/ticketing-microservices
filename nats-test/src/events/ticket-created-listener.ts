import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log(`Ticket created event received with data: ${JSON.stringify(data)}`);
    // Process the ticket created event here

    console.log(`Ticket ID: ${data.id}`);
    console.log(`Title: ${data.title}`);
    console.log(`Price: ${data.price}`);

    msg.ack(); // Acknowledge the message
  }
}