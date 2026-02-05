import express from 'express';
import 'express-async-errors';

import { errorHandler } from '@higorticketing/common';
import { NotFoundError, currentUser } from '@higorticketing/common';
import cookieSession from 'cookie-session';
import { createTicketRouter as createT } from './routes/new';
import { showTicketRouter as showT } from './routes/show';
import { indexTicketRouter as indexT } from './routes/index';
import { updateTicketRouter as updateT } from './routes/update';

const app = express();

// Confia em cabecalhos de proxy reverso
app.set('trust proxy', true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}));

app.use(currentUser);

app.use(createT);
app.use(showT);
app.use(indexT);
app.use(updateT);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };