import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';

it('marks an order as cancelled', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    const user = global.signin();
    // make a request to create an order with this ticket

    const { body: order } = await request(app)
        .post(`/api/orders`)
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make request to cancel the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);

        await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .expect(401);

    // expectation to make sure the thing is cancelled
});

it.todo('emits a order cancelled event')