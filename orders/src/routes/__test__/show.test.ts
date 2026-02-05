import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../model/ticket';
import { Order, OrderStatus } from '../../model/order';

it('returns an error if one user tries to fetch another user order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    const user = global.signin();
    // make a request to build a ticket with this ticket

    const { body: order } = await request(app)
        .post(`/api/orders`)
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make request to cancel the order
    const { body: fetchedOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    // expectation to make sure the thing  is cancelled
    expect(fetchedOrder.id).toEqual(order.id);

        await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .expect(401);

    // expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

    
});

