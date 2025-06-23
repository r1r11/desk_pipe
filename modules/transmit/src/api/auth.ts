import { Hono } from "hono";

import { Auth } from '@auth/core'
import Google from '@auth/core/providers/google'
import GitHub from '@auth/core/providers/github'

import { D1Adapter } from '@auth/d1-adapter';


import { DeskPipeContext } from "../model";


export const auth_api = new Hono<DeskPipeContext>();



auth_api.all('/*', async (c) => {
    const res = await Auth(c.req.raw, {
        providers: [
            Google({
                clientId: c.env.AUTH_GOOGLE_ID,
                clientSecret: c.env.AUTH_GOOGLE_SECRET,
            }),
            GitHub({
                clientId: c.env.AUTH_GITHUB_ID,
                clientSecret: c.env.AUTH_GITHUB_SECRET,
            }),
        ],
        adapter: D1Adapter(c.env.DB),
        secret: c.env.AUTH_SECRET,
        trustHost: true,
        cookies: {
            sessionToken: {
                name: 'next-auth.session-token',
                options: {
                    secure: true,
                    sameSite: 'lax',
                    path: '/',
                },
            },
        },
    });

    return res;
});