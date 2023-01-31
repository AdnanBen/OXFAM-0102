import * as jose from 'jose';
import { JWT } from 'next-auth/jwt';
import * as crypto from "crypto"
// const { createSecretKey } = require('crypto');

// If null, JWT signature is invalid. Else, it is valid and payload is returned
// only works on server side, not browser due to "crypto" library
export default async function decode(params: {
    token: string
    secret: string
  }): Promise<JWT | null> {
    const secretKey = crypto.createSecretKey(params.secret, 'utf-8');
    const { payload, protectedHeader } = await jose.jwtVerify(params.token, secretKey)
    return payload ? payload : null;
  }