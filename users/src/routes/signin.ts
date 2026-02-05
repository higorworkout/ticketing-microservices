import express from 'express'
import { body } from 'express-validator';
import { Router, Request, Response } from 'express';
import { validateRequest } from '@higorticketing/common';
import { User } from '../model/user';
import { BadRequestError } from '@higorticketing/common';
import { Password } from '../services/password';
import { sign } from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
    ], validateRequest, async (req: Request, res: Response) => {
       const { email, password } = req.body 

       const existingUser = await User.findOne({ email });

       if (!existingUser) {
          throw new BadRequestError('Invalid credentials');
       };

       const passwordsMatch = await Password.compare(existingUser.password, password);


       if (!passwordsMatch) {
          throw new BadRequestError('Invalid credentials');
       };


    // Generate Jwt
    const userJwt = sign({ 
      id: existingUser.id,
      email: existingUser.email
     }, process.env.JWT_KEY!);

    // Store it on session object
     req.session = { jwt: userJwt }

    res.status(201).send(existingUser);

});

export { router as signinRouter };
