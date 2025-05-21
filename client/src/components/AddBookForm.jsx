import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import styles from "../styles/AddBookForm.module.css";
import { Link, useNavigate } from "react-router-dom";
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
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookList()
      .then((res) => {
        setBookList(res || []);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setBookList([]);
      });

    fetchAuthorList()
      .then((data) => {
        setAuthorList(data || []);
      })
      .catch((err) => {
        console.error("Error fetching authors:", err);
        setAuthorList([]);
      });
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!title || !summary || !isbn || !dateRead || !authorId) {
      setFormError("Please fill in all fields correctly");
      return;
    }

    const book = {
      title,
      summary,
      isbn,
      date_read: dateRead,
      author_id: authorId,
    };

    const { data, error } = await supabase
      .from("books")
      .insert([book])
      .select();

    if (error) {
      console.log("Error adding book", error);
      setFormError(error);
    }

    if (data) {
      console.log(data);
      setFormError(null);
      setTitle("");
      setSummary("");
      setIsbn("");
      setDateRead("");
      setAuthorId("");
      navigate("/");
    }
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    const author = { first_name: authorFirstName, last_name: authorLastName };

    const { data, error } = await supabase
      .from("authors")
      .insert([author])
      .select();

    if (error) {
      console.log("Error adding author", error);
      setFormError(error);
    }

    if (data) {
      console.log(data);
      setAuthorFirstname("");
      setAuthorLastname("");
      setFormError(null);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    const noteData = {
      note_content: noteContent,
      bookId: document.getElementById("selectedBook").value,
      created_date: createdDate,
    };

    console.log(document.getElementById("selectedBook").value);

    const { data, error } = await supabase
      .from("notes")
      .insert([noteData])
      .select();

    if (error) {
      console.log("Error adding note", error);
      setFormError(error);
    }

    if (data) {
      setFormError(null);
      setNoteContent("");
      setCreatedDate("");
    }
  };

  return (
    <div className={styles.adminPage}>
      <Link to="/">Go Home</Link>
      <div className={styles.addBookForms}>
        <form className={styles.form} onSubmit={handleAddBook}>
          <h2>Add A Book</h2>
          {formError && <p>{formError}</p>}
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
