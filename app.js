import { Hono } from "jsr:@hono/hono@4.6.5";
import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

const BANNED_WORDS = [
  "delete", "update", "insert", "drop", "alter", "create",
  "truncate", "replace", "merge", "grant", "revoke",
  "transaction", "commit", "rollback", "savepoint", "lock",
  "execute", "call", "do", "set", "comment"
];

const query = async (query) => {
  for (const word of BANNED_WORDS) {
    if (query.toLowerCase().includes(word)) {
      throw new Error(`You cannot ${word} data`);
    }
  }

  const sql = postgres({
    max: 2,
    max_lifetime: 10,
    host: "db.ukhjzmuyujpfpyaacjcs.supabase.co",
    port: 5432,
    database: "postgres",
    username: "postgres",
    password: "Nano2003Esupabas!",
  });

  const result = await sql.unsafe(query);
  return result;
};

const app = new Hono();

app.get("/*", (c) => {
  return c.html(`
    <html>
      <head>
        <title>Hello, world!</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
        <p>Send a POST with { "query": "SELECT 1 + 1 AS sum" }</p>
      </body>
    </html>
  `);
});

app.post("/*", async (c) => {
  const body = await c.req.json();
  const result = await query(body.query);
  return c.json({ result });
});

Deno.serve(app.fetch);
