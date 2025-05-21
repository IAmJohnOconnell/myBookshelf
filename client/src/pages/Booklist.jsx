import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchImage } from "../services/utilitiesService";
import supabase from "../config/supabaseClient";
import styles from "../styles/BookList.module.css";

const Booklist = () => {
  const [bookList, setBookList] = useState([]);
  const [bookImages, setBookImages] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const [session, setSession] = useState(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data.session);
    console.log(currentSession);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    const fetchBookList = async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          `id, title, summary, isbn, date_read, authors (id, first_name, last_name)`
        );

      if (error) {
        setFetchError("Error fetching book list");
        setBookList(null);
        console.log(error);
      }
      if (data) {
        setBookList(data);
        setFetchError(null);

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
      }
    };

    fetchBookList();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

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
        {session ? (
          <>
            <Link className={styles.addBookButton} to="/addBook">
              <button>Add Book</button>
            </Link>
            <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <Link className={styles.addBookButton} to="/login">
            {/* <button>Login</button> */}
          </Link>
        )}
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
                    by {book.authors.first_name} {book.authors.last_name}
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
