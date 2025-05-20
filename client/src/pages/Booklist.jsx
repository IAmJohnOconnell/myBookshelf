import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchImage } from "../services/utilitiesService";
import styles from "../styles/BookList.module.css";

const Booklist = () => {
  const [bookList, setBookList] = useState([]);
  const [bookImages, setBookImages] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => {
        // data.forEach((book) => {
        //   console.log(`Book: ${book.title}, ID: ${book.id}`);
        // });
        setBookList(data);
        // console.log(data);

        data.forEach((book) => {
          if (book.isbn) {
            fetchImage(book.isbn).then((img) => {
              if (img) {
                setBookImages((prev) => ({
                  ...prev,
                  [book.isbn]: img.src,
                }));
              }
            });
          }
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className={styles.bookShelf}>
      <h1>My Recent Reading</h1>
      <p>
        A curated collection of books I’ve recently finished, along with
        personal notes, reflections, and key takeaways from each. Whether you're
        looking for your next great read or just curious about what’s been on my
        shelf, this page offers a glimpse into my reading journey.
      </p>
      <div className="links">
        {/* <Link className={styles.addBookButton} to="/login">
          Login
        </Link> */}
      </div>
      <ul>
        {bookList &&
          bookList.map((book) => {
            return (
              <li key={book.id}>
                <div className={styles.book}>
                  <Link to={`/book/${book.title}`} state={book}>
                    {book.isbn && bookImages[book.isbn] && (
                      <img
                        src={bookImages[book.isbn]}
                        alt={`Cover of ${book.title}`}
                        className={styles.coverImage}
                      />
                    )}
                    <h2 className={styles.bookTitle}>{book.title}</h2>
                  </Link>
                  <h3 className={styles.author}>
                    by {book.first_name} {book.last_name}
                  </h3>
                  <p>{book.summary}</p>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Booklist;
