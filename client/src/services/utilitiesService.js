export const formatDate = (date) => {
  if (!date) {
    console.error("Date has not been provided");
    return;
  }

  let formattedDate = date.split("T")[0];
  let splitDate = formattedDate.split("-");
  return (formattedDate = `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`);
};

export const fetchImage = async (isbn) => {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  // console.log(url);
  try {
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};
