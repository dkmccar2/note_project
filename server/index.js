import express from "express";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import { sql } from "@vercel/postgres";

env.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
// const pool = new Pool({
//   //env variables
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
// });
// const pool = new Pool({
//   //env variables
//   user: process.env.POSTGRES_USER,
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DATABASE,
//   password: process.env.POSTGRES_PASSWORD,
//   // port: process.env.PG_PORT,
// });
const corsOptions = {
  origin: "https://note-project-client.vercel.app",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = express();
const port = 4000;

app.use(cors(corsOptions)); //middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/getnotes", async (req, res) => {
  console.log("<------------------------>");
  console.log("Get route activated");
  const result = await sql("SELECT * FROM notes");
  //const result = await pool.query("SELECT * FROM notes");
  if (result) {
    console.log("Existing notes loaded from db");
  }
  res.send(result.rows);
});

app.post("/addnote", async (req, res) => {
  console.log("<------------------------>");
  console.log("Post route activated");

  const title = req.body.title;
  const content = req.body.content;
  const result = await sql(
    `INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING id`,
    [title, content]
  );
  // const result = await pool.query(
  //   `INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING id`,
  //  [title, content]
  // );
  const idReturn = result.rows[0].id;
  console.log("Returning id " + result.rows[0].id);

  if (result) {
    console.log("Note added to database");
  }
  res.json(idReturn);
});

app.delete("/deletenote/:id", async (req, res) => {
  console.log("<------------------------>");
  console.log("Delete route activated");
  const id = parseInt(req.params.id);
  const data = req.body;

  console.log("Deleting note with id: " + id);
  const result = await sql(`DELETE FROM notes WHERE id = ${id}`);
  //const result = await pool.query(`DELETE FROM notes WHERE id = ${id}`);

  if (result) {
    console.log("Note successfully deleted");
  }
  res.json({ message: "Data received successfully", data });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, http://localhost:${port}`);
});
