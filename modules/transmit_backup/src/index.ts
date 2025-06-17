import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/message", (c) => {
  
  
// This endpoint returns a simple text response 
  
  return c.text("リリーのメッ");
});

export default app;
