import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { formatDate, fetchImage } from "../services/utilitiesService";
import { fetchBooknotes } from "../services/apiService";
import styles from "../styles/BookDetails.module.css";

const BookDatails = () => {
  const location = useLocation();
  const book = location.state;
  const dateRead = formatDate(book.date_read);
  const [coverImage, setCoverImage] = useState();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (book.isbn) {
      fetchImage(book.isbn)
        .then((img) => {
          if (img) {
            setCoverImage(img.src);
          }
        })
        .catch((err) => {
          console.error("Error loading cover image");
        });
    }

    fetchBooknotes(book.id)
      .then((res) => {
        setNotes(res || []);
      })
      .catch((err) => {
        console.log("Error fetching notes", err);
      });
  }, []);

  return (
    <>
      <div className={styles.homeButton}>
        <Link to="/">Go Home</Link>
      </div>
      <div className={styles.book}>
        <div className={styles.header}>
          <img
            className={styles.coverImage}
            src={coverImage}
            alt={`Cover of ${book.title}`}
          />
          <div className={styles.bookDetails}>
            <h1>{book.title}</h1>
            <p>ISBN: {book.isbn}</p>
            <p>Date Read: {dateRead}</p>
          </div>
        </div>
        <div className={styles.notes}>
          {notes && notes.length > 0 ? (
            notes.map((note) => {
              return <p key={notes.indexOf(note)}>{note.note_content}</p>;
            })
          ) : (
            <p>
              You haven't written any notes for this book yet. Here is some
              nonsens instead: <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
              quod ipsum labore at fugiat iusto eaque illo quibusdam voluptas
              saepe est, sit, placeat itaque sint consequatur nemo consectetur
              assumenda repudiandae!
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default BookDatails;
