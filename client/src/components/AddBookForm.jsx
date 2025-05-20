import { useState, useEffect } from "react";
import styles from "../styles/AddBookForm.module.css";
import { Link } from "react-router-dom";
import { fetchBookList, fetchAuthorList } from "../services/apiService";

const AddBookForm = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [isbn, setIsbn] = useState();
  const [dateRead, setDateRead] = useState();
  const [createdDate, setCreatedDate] = useState();
  const [authorId, setAuthorId] = useState("");
  const [authorFirstName, setAuthorFirstname] = useState("");
  const [authorLastName, setAuthorLastname] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [bookList, setBookList] = useState([]);
  const [authorList, setAuthorList] = useState([]);

  useEffect(() => {
    fetchBookList()
      .then((res) => {
        // console.log(res);
        setBookList(res || []);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setBookList([]);
      });

    fetchAuthorList()
      .then((data) => {
        // console.log(data);
        setAuthorList(data || []);
      })
      .catch((err) => {
        console.error("Error fetching authors:", err);
        setAuthorList([]);
      });
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    const book = {
      title,
      summary,
      isbn,
      dateRead,
      authorId,
    };

    try {
      const res = await fetch("http://localhost:3000/addBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      if (res.ok) {
        const data = await res.json();
        setTitle("");
        setSummary("");
        setIsbn("");
        setDateRead("");
        setAuthorId("");
      } else {
        console.log("Failed to save Book");
      }
    } catch (err) {
      console.log("Error occurred while saving book", err);
    }
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    const author = { authorFirstName, authorLastName };
    try {
      const res = await fetch("http://localhost:3000/addAuthor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(author),
      });
      if (res.ok) {
        const data = await res.json();
        setAuthorFirstname("");
        setAuthorLastname("");
      } else {
        console.log("Failed to save author");
      }
    } catch (err) {
      console.log("Error occured while saving author", err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    const noteData = {
      noteContent: noteContent,
      bookId: document.getElementById("selectedBook").value,
      createdDate: createdDate,
    };

    console.log(document.getElementById("selectedBook").value);

    try {
      const res = await fetch("http://localhost:3000/addNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
      if (res.ok) {
        const data = await res.json();
        setNoteContent("");
        setCreatedDate("");
      } else {
        console.log("Failed to save note");
      }
    } catch (err) {
      console.log("Error occurred when saving note");
    }
  };

  return (
    <div className={styles.adminPage}>
      <Link to="/">Go Home</Link>
      <div className={styles.addBookForms}>
        <form className={styles.form} onSubmit={handleAddBook}>
          <h2>Add A Book</h2>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="summary">Summary</label>
          <input
            type="textarea"
            name="summary"
            value={summary}
            required
            onChange={(e) => setSummary(e.target.value)}
          />
          <label htmlFor="isbn">ISBN</label>
          <input
            type="number"
            name="isbn"
            value={isbn}
            required
            onChange={(e) => setIsbn(e.target.value)}
          />
          <label htmlFor="date_read">Date Read</label>
          <input
            type="date"
            name="date_read"
            value={dateRead}
            required
            onChange={(e) => setDateRead(e.target.value)}
          />
          <label htmlFor="author_id">Author</label>
          <select
            name="authorList"
            id="authorList"
            onChange={(e) => {
              setAuthorId(e.target.value);
              console.log(authorId);
            }}
          >
            <option value="">--Select an Author--</option>
            {authorList &&
              authorList.map((author) => {
                return (
                  <option key={author.id} value={author.id}>
                    {author.first_name} {author.last_name}
                  </option>
                );
              })}
          </select>

          <button type="submit">Add Book</button>
        </form>

        <form className={styles.form} onSubmit={handleAddAuthor}>
          <h2>Add An Author</h2>
          <label htmlFor="author_first_name">Author's First Name</label>
          <input
            type="text"
            name="author_first_name"
            value={authorFirstName}
            required
            onChange={(e) => setAuthorFirstname(e.target.value)}
          />
          <label htmlFor="author_last_name">Author's Last Name</label>
          <input
            type="text"
            name="author_last_name"
            value={authorLastName}
            required
            onChange={(e) => setAuthorLastname(e.target.value)}
          />
          <button type="submit">Add Author</button>
        </form>
      </div>

      <h2>Add A Note</h2>
      <form
        className={`${styles.form} ${styles.addNotesForm}`}
        onSubmit={handleAddNote}
      >
        <label htmlFor="noteContent">Add Note To:</label>
        <select name="selectedBook" id="selectedBook">
          <option value="">--Select a Book To Add A Note To--</option>
          {bookList &&
            bookList.map((book) => {
              return (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              );
            })}
        </select>

        <label htmlFor="noteContent">Note Content:</label>
        <textarea
          type="textarea"
          name="noteContent"
          value={noteContent}
          rows="5"
          columns="35"
          onChange={(e) => setNoteContent(e.target.value)}
        />

        <label htmlFor="date_created">Date Created:</label>
        <input
          type="date"
          name="date_created"
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default AddBookForm;
