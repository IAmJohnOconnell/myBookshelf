export const fetchBookList = async () => {
  try {
    const response = await fetch("http://localhost:3000/");
    if (!response.ok) {
      throw new Error("Error fetching books");
    }
    let data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log("Failed to fetch books");
    return [];
  }
};

export const fetchBooknotes = async (bookId) => {
  try {
    const response = await fetch(`http://localhost:3000/book/${bookId}/`);
    if (!response.ok) {
      throw new Error(`Error fetching notes for book`);
    }
    let data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log("Failed to fetch book notes");
    return [];
  }
};

export const fetchAuthorList = async () => {
  try {
    const response = await fetch("http://localhost:3000/authors");
    if (!response.ok) {
      throw new Error("Error fetching authors");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching authors", error);
    return [];
  }
};
