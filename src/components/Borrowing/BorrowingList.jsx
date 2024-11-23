import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const BorrowingList = () => {
  // State to store the list of borrowings
  const [borrowings, setBorrowings] = useState([]);
  // State to track the selected borrowing ID for viewing details
  const [selectedBorrowingId, setSelectedBorrowingId] = useState(null);
  // State to handle and display errors
  const [error, setError] = useState("");
// Fetch borrowings when the component is mounted
  useEffect(() => {
    fetchBorrowings();
  }, []);
// Function to fetch the list of borrowings from the backend
  const fetchBorrowings = async () => {
    try {
      const response = await api.get('/borrows'); // API call to fetch borrowings
      setBorrowings(response.data); // Update the state with the fetched data
      setError(""); // Reset error state if data fetch is successful
    } catch {
      setError("Error fetching borrowings"); // Set error message in case of failure
      toast.error("Error fetching borrowings"); // Display error notification
    }
  };
// Function to delete a borrowing record by its ID
  const deleteBorrowing = async (id) => {
    try {
      await api.delete(`/borrows/${id}`); // API call to delete the borrowing
      fetchBorrowings();  // Refresh the list of borrowings
      toast.success("Borrowing record deleted successfully!"); // Display success notification
    } catch {
      toast.error("Error deleting borrowing record"); // Display error notification

    }
  };
// Function to toggle the visibility of borrowing details
  const toggleDetails = (id) => {
    // Toggle the selected borrowing ID
    setSelectedBorrowingId(selectedBorrowingId === id ? null : id);
  };

  return (
    <div className="page-content">
      <h1>Borrowings</h1>
       {/* Display error message if any */}
      {error && <div className="error">{error}</div>}
      {/* Link to navigate to the Add Borrowing form */}
      <Link to="/borrowings/new">
        <button className="add-btn">Add New Borrowing</button>
      </Link>
      {/* Table to display the list of borrowings */}
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
            {/* Map through the list of borrowings and display each record */}
            {borrowings.map((borrowing) => (
              <React.Fragment key={borrowing.id}>
                <tr>
                  <td>{borrowing.id}</td>
                  <td>{borrowing.borrowerName}</td>
                  <td>{borrowing.borrowingDate}</td>
                  <td>{borrowing.returnDate || "Not returned yet"}</td>
                  <td className="actions">
                    {/* Button to toggle details visibility */}
                    <button
                      className="view-btn"
                      onClick={() => toggleDetails(borrowing.id)}
                    >
                      {selectedBorrowingId === borrowing.id ? "Hide" : "View"}
                    </button>
                    {/* Link to navigate to the Edit Borrowing form */}
                    <Link to={`/borrowings/edit/${borrowing.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    {/* Button to delete the borrowing record */}
                    <button
                      className="delete-btn"
                      onClick={() => deleteBorrowing(borrowing.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {/* Conditional rendering for borrowing details */}
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
