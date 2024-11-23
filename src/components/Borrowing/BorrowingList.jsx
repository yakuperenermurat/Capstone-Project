import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const BorrowingList = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [selectedBorrowingId, setSelectedBorrowingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const response = await api.get('/borrows');
      setBorrowings(response.data);
      setError("");
    } catch {
      setError("Error fetching borrowings");
      toast.error("Error fetching borrowings");
    }
  };

  const deleteBorrowing = async (id) => {
    try {
      await api.delete(`/borrows/${id}`);
      fetchBorrowings();
      toast.success("Borrowing record deleted successfully!");
    } catch {
      toast.error("Error deleting borrowing record");
    }
  };

  const toggleDetails = (id) => {
    setSelectedBorrowingId(selectedBorrowingId === id ? null : id);
  };

  return (
    <div className="page-content">
      <h1>Borrowings</h1>
      {error && <div className="error">{error}</div>}
      <Link to="/borrowings/new">
        <button className="add-btn">Add New Borrowing</button>
      </Link>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Borrower Name</th>
              <th>Borrowing Date</th>
              <th>Return Date</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.map((borrowing) => (
              <React.Fragment key={borrowing.id}>
                <tr>
                  <td>{borrowing.id}</td>
                  <td>{borrowing.borrowerName}</td>
                  <td>{borrowing.borrowingDate}</td>
                  <td>{borrowing.returnDate || "Not returned yet"}</td>
                  <td className="actions">
                    <button
                      className="view-btn"
                      onClick={() => toggleDetails(borrowing.id)}
                    >
                      {selectedBorrowingId === borrowing.id ? "Hide" : "View"}
                    </button>
                    <Link to={`/borrowings/edit/${borrowing.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBorrowing(borrowing.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {selectedBorrowingId === borrowing.id && (
                  <tr className="details-row">
                    <td colSpan="5">
                      <div className="details">
                        <h3>Borrowing Details</h3>
                        <p><strong>ID:</strong> {borrowing.id}</p>
                        <p><strong>Borrower Name:</strong> {borrowing.borrowerName}</p>
                        <p><strong>Borrower Email:</strong> {borrowing.borrowerMail || "N/A"}</p>
                        <p><strong>Borrowing Date:</strong> {borrowing.borrowingDate}</p>
                        <p><strong>Return Date:</strong> {borrowing.returnDate || "Not returned yet"}</p>
                        <p><strong>Book Name:</strong> {borrowing.book?.name || "N/A"}</p>
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

export default BorrowingList;
