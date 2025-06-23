import { Hono } from 'hono'


import { DeskPipeContext, Env, User } from './model'


import { notes } from './api/notes';
import { auth_api } from './api/auth'


// The main Hono app
const app = new Hono<DeskPipeContext>()




app.route('/api/auth',  auth_api);
app.route('/api/notes', notes);


export default app