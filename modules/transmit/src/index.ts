
import { DeskPipeContext, Env, User } from './model'

import { Hono } from 'hono'

import { Auth } from '@auth/core'
import Google from '@auth/core/providers/google'
import GitHub from '@auth/core/providers/github'


import { notes } from './api/notes';
import { auth_api } from './api/auth'


// The main Hono app
const app = new Hono<DeskPipeContext>()




app.route('/api/auth',  auth_api);
app.route('/api/notes', notes);


export default app