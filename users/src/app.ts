import express from 'express';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from '@higorticketing/common';
import { NotFoundError } from '@higorticketing/common';
import cookieSession from 'cookie-session';

const app = express();

// Confia em cabecalhos de proxy reverso
app.set('trust proxy', true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: false,
}));

//  process.env.NODE_ENV !== 'test',    

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };