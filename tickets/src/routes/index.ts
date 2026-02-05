import express, { Request, Response } from 'express';
import { Ticket } from '../model/ticket';
import { NotFoundError } from '@higorticketing/common';

const router = express.Router();
router.get('/api/tickets', async (req: Request, res: Response) => {
    const ticket = await Ticket.find({});
    
    res.send(ticket);
    
});

export { router as indexTicketRouter };