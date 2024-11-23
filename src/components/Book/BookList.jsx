import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const BookList = () => {
  // State to manage the list of books
  const [books, setBooks] = useState([]);
  // State to track which book's details are currently displayed
  const [selectedBookId, setSelectedBookId] = useState(null);
  // State to handle errors during API requests
  const [error, setError] = useState("");

  // Fetch the list of books when the component is mounted
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to fetch all books from the backend
  const fetchBooks = async () => {
    try {
      const response = await api.get('/books'); // API call to get books
      setBooks(response.data); // Set the books state with the response data
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Error fetching books"); // Handle fetch error
      toast.error("Error fetching books"); // Show error notification
    }
  };

  // Function to delete a book by its ID
  const deleteBook = async (id) => { // API call to delete the book
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();  // Refresh the list of books
      toast.success("Book deleted successfully!"); // Show success notification

    } catch (err) {
      toast.error("Error deleting book");  // Show error notification
    }
    }
  };

  // Function to toggle the display of book details
  const toggleDetails = (id) => {
    setSelectedBookId(selectedBookId === id ? null : id); // Toggle details for the selected book
  };

  return (
    <div className="page-content">
      {/* Page Title */}
      <h1>Books</h1>
      {/* Display error message if there is an error */}
      {error && <div className="error">{error}</div>}
      {/* Button to navigate to the "Add New Book" form */}
      <Link to="/books/new">
        <button className="add-btn">Add New Book</button>
      </Link>

      {/* Table to display the list of books */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Publication Year</th>
              <th>Stock</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through the list of books */}
            {books.map((book) => (
              <React.Fragment key={book.id}>
                <tr>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.stock}</td>
                  <td className="actions">
                    {/* Button to view or hide book details */}
                    <button
                      className="view-btn"
                      onClick={() => toggleDetails(book.id)}
                    >
                      {selectedBookId === book.id ? "Hide" : "View"}
                    </button>
                    {/* Link to navigate to the edit page for this book */}
                    <Link to={`/books/edit/${book.id}`}>
                      {/* Button to delete this book */}
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBook(book.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {/* Show book details if the current book is selected */}
                {selectedBookId === book.id && (
                  <tr className="details-row">
                    <td colSpan="5">
                      <div className="details">
                        <h3>Book Details</h3>
                        <p><strong>ID:</strong> {book.id}</p>
                        <p><strong>Name:</strong> {book.name}</p>
                        <p><strong>Publication Year:</strong> {book.publicationYear}</p>
                        <p><strong>Stock:</strong> {book.stock}</p>
                        <p><strong>Author:</strong> {book.author?.name || "N/A"}</p>
                        <p><strong>Categories:</strong> {book.categories?.map((cat) => cat.name).join(", ") || "N/A"}</p>
                        <p><strong>Publisher:</strong> {book.publisher?.name || "N/A"}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
