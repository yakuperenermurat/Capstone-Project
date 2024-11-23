import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching books");
      toast.error("Error fetching books");
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
      toast.success("Book deleted successfully!");
    } catch (err) {
      toast.error("Error deleting book");
    }
  };

  const toggleDetails = (id) => {
    setSelectedBookId(selectedBookId === id ? null : id);
  };

  return (
    <div className="page-content">
      <h1>Books</h1>
      {error && <div className="error">{error}</div>}
      <Link to="/books/new">
        <button className="add-btn">Add New Book</button>
      </Link>
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
            {books.map((book) => (
              <React.Fragment key={book.id}>
                <tr>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.stock}</td>
                  <td className="actions">
                    <button
                      className="view-btn"
                      onClick={() => toggleDetails(book.id)}
                    >
                      {selectedBookId === book.id ? "Hide" : "View"}
                    </button>
                    <Link to={`/books/edit/${book.id}`}>
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
