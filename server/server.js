import dotenv from "dotenv";
import express from "express";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
const port = 3000;
const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT books.id AS id, books.title, books.summary, books.isbn, books.date_read, authors.first_name, authors.last_name, authors.id AS author_id FROM books JOIN authors ON books.author_id = authors.id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

app.post("/addBook", async (req, res) => {
  const { title, summary, isbn, dateRead, authorId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO books (title, summary, isbn, date_read, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, summary, isbn, dateRead, authorId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

app.post("/addAuthor", async (req, res) => {
  const { authorFirstName, authorLastName } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO authors (first_name, last_name) VALUES ($1, $2) RETURNING *",
      [authorFirstName, authorLastName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding author");
  }
});

app.post("/addNote", async (req, res) => {
  const { noteContent, createdDate, bookId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (note_content, created_date, book_id) VALUES ($1, $2, $3) RETURNING *",
      [noteContent, createdDate, bookId]
    );
    console.log(result.rows);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding note");
  }
});

app.get("/book/:bookId", async (req, res) => {
  console.log(req.params);
  const bookId = req.params.bookId;
  try {
    const result = await pool.query(
      "SELECT * FROM notes JOIN books ON notes.book_id = books.id WHERE notes.book_id = ($1)",
      [bookId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching notes for book");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      email,
    ]);
    console.log("User found:", result.rows[0]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      bcrypt.compare(loginPassword, storedHashedPassword, (err, isMatch) => {
        if (err) {
          console.log("Error comparing passwords:", err);
          res
            .status(500)
            .json({ success: false, message: "Error comparing passwords" });
        } else {
          console.log("Password match:", isMatch); // Log whether the passwords match
          if (isMatch) {
            res.json({ success: true, redirectTo: "/addBook" });
          } else {
            res.json({ success: false, message: "Incorrect Password" });
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/authors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM authors");
    res.json(result.rows);
    console.log(result);
  } catch (err) {
    console.error("Error fetching authors", err);
    res.status(500).json({ error: "Failed to fetch authors" });
  }
});

// app.post("/register", async (req, res) => {
//   const email = req.body.username;
//   const password = req.body.password;

//   try {
//     const checkResult = await pool.query(
//       "SELECT * FROM users WHERE username = $1",
//       [email]
//     );

//     if (checkResult.rows.length > 0) {
//       res.json({
//         success: false,
//         message: "Email already exists. Try logging in.",
//       });
//     } else {
//       bcrypt.hash(password, 10, async (err, hash) => {
//         if (err) {
//           console.log("Error hashing password", err);
//           res
//             .status(500)
//             .json({ success: false, message: "Error hashing password" });
//         } else {
//           console.log("Hashed Password", hash);
//           const result = await pool.query(
//             "INSERT INTO users (username, password) VALUES ($1, $2)",
//             [email, hash]
//           );
//           console.log(result);
//           res.json({ success: true, redirectTo: "/login" });
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, message: "Error registering user" });
//   }
// });

app.listen(3000, () => {
  console.log(`Server running on port ${port}.`);
});
