import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@higorticketing/common';
import { Order, OrderStatus } from '../model/order';
import { OrderCancelledPublisher } from '../events/publisher/order-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderid', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

     if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {      
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.id
        }
    })
    
    res.status(204).send(order);
    
});

export { router as deleteOrderRouter };