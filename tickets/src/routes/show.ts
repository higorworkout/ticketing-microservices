import express, { Request, Response, RequestHandler } from 'express';
import { Ticket } from '../model/ticket';
import { NotFoundError } from '@higorticketing/common';

const router = express.Router();
router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
        throw new NotFoundError();
    }

    
    res.send(ticket);
    
});

export { router as showTicketRouter };