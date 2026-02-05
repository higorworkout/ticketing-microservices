import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@higorticketing/common';
import { Ticket } from '../model/ticket';
import { Order } from '../model/order';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';  

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

// This route handler will handle requests to create a new order
router.post('/api/orders', requireAuth, [
    body('ticketId')
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .not()
    .isEmpty()
    .withMessage('Ticket ID is required'),
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }


    // Make sure the ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket is reserved
    // is the ticket we just found and the order is not cancelled
    const isReserved = await ticket.isReserved();

    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved');
    }


 
    // Calculate an expiration date for this order
    let expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); // Order expires in 15 seconds


    // Create the order and save it to the database

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    
    await order.save();


    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        version: order.version, 
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })

    res.status(201).send(order);
});

export { router as newOrderRouter };