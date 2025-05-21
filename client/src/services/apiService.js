import supabase from "../config/supabaseClient";

export const fetchBookList = async () => {
  const { data, error } = await supabase.from("books").select();
  if (error) {
    console.log("Error fetching books", error);
  }

  if (data) {
    console.log(data);
    return data;
  }
};

export const fetchBooknotes = async (bookId) => {
  const { data, error } = await supabase
    .from("notes")
    .select(`*, books (*)`)
    .eq("book_id", bookId);

  if (error) {
    console.log("Error fetching notes for books", error);
  }

  if (data) {
    return data;
  }
};

export const fetchAuthorList = async () => {
  const { data, error } = await supabase.from("authors").select();

  if (error) {
    console.log("Error fetching authors", error);
  }
  if (data) {
    console.log(data);
    return data;
  }
};
