import { TicketCreatedEvent } from "@higorticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0, 
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // create a fake message object
}

it('Creates and saves a ticket', async () => {
    

    // call the onMessage function with the data object + message object

    // write assertions to make sure a ticket was created

});


it('acks the message', async () => {
    // create an instance of the listener

    // create a fake data event

    // create a fake message object

    // call the onMessage function with the data object + message object

    // write assertions to make sure ack function is called
});