import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { Order } from '../../model/order';
import mongoose from 'mongoose';

const createTicket = async (title: string, price: number ) => {
    const ticket = Ticket.build({
        title: title || 'concert',
        price: price || 20,
    });
    await ticket.save();

    return ticket;
};

it('can fetch a list of order an particular user', async () => {
    // Create 3 tickets
    const ticketOne = await createTicket('calcinha preta', 25);
    const ticketTwo = await createTicket('forro', 30);
    const ticketThree = await createTicket('sertanejo', 35);

    const userOne = global.signin();
    const userTwo = global.signin();
    // Create one order as User #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);

    // Create two orders as User #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);
    
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);

    // Make request to get orders for User #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    console.log(orderOne);
    // Make sure we only get the orders for User #2, and not User #1
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketThree.id);
    expect(response.body[1].ticket.id).toEqual(ticketTwo.id);

});