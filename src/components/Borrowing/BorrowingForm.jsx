import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const BorrowingForm = () => {
  // State to manage borrowing details
  const [borrowing, setBorrowing] = useState({
    borrowerName: "", // Name of the borrower
    borrowerMail: "", // Email of the borrower
    borrowingDate: "", // Date when the book is borrowed
    bookForBorrowingRequest: { id: "" }, // Book selected for borrowing
    returnDate: "", // Date when the book is expected to be returned
  });
  // State to manage the list of books
  const [books, setBooks] = useState([]);
  // Fetch parameters from the route
  const { id } = useParams();
  // Navigate function to redirect to different routes
  const navigate = useNavigate();

  // useEffect to fetch necessary data when the component mounts or `id` changes
  useEffect(() => {
    if (!id) {
      fetchBooks(); // Fetch list of books for new borrowing
    }
    if (id) {
      fetchBorrowing();  // Fetch borrowing details for editing
    }
  }, [id]);

  // Function to fetch the list of books from the backend
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books"); 
      setBooks(response.data); // Update state with fetched books
    } catch {
      toast.error("Error fetching books."); // Show error notification
    }
  };

  // Function to fetch borrowing details if editing
  const fetchBorrowing = async () => {
    try {
      const response = await api.get(`/borrows/${id}`);
      setBorrowing({
        borrowerName: response.data.borrowerName || "", // Fetched borrower name
        borrowingDate: response.data.borrowingDate || "", // Fetched borrowing date
        returnDate: response.data.returnDate || "", // Fetched return date
        bookForBorrowingRequest: {
          id: response.data.book?.id || "", // Fetched book ID
        },
      });
    } catch {
      toast.error("Error fetching borrowing data."); // Show error notification
    }
  };

  // Handle input changes and update the state dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special handling for book selection
    if (name === "bookForBorrowingRequest") {
      setBorrowing((prev) => ({
        ...prev,
        bookForBorrowingRequest: { id: value },  // Update book ID
      }));
    } else {
      setBorrowing((prev) => ({ ...prev, [name]: value })); // Update other fields
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check the stock of the selected book
      const selectedBook = books.find(
        (book) => book.id === parseInt(borrowing.bookForBorrowingRequest.id, 10)
      );
  
      if (selectedBook && selectedBook.stock === 0) {
        toast.error("Stock is empty! Cannot borrow this book.");  // Show error if stock is empty
        return; // Stop further execution
      }

          // Validate borrowing date and return date in edit mode
    if (id && borrowing.returnDate && borrowing.borrowingDate) {
      const borrowingDate = new Date(borrowing.borrowingDate);
      const returnDate = new Date(borrowing.returnDate);

      if (borrowingDate > returnDate) {
        toast.error("Borrowing date cannot be later than the return date.");  // Show error if dates are invalid
        return; // Stop further execution
      }
    }
      // Prepare borrowing data to be sent to the backend
      const borrowingData = {
        borrowerName: borrowing.borrowerName,
        borrowingDate: borrowing.borrowingDate,
        returnDate: borrowing.returnDate || null, // Return date is optional
        ...(id ? {} : { borrowerMail: borrowing.borrowerMail }),  // Include email only for new borrowing
        bookForBorrowingRequest: id
          ? undefined
          : { id: parseInt(borrowing.bookForBorrowingRequest.id, 10) }, // Include book only for new borrowing
      };
  
      if (id) {
        await api.put(`/borrows/${id}`, borrowingData);
        toast.success("Borrowing updated successfully!");
      } else {
        await api.post("/borrows", borrowingData);
        toast.success("Borrowing added successfully!");
      }
      navigate("/borrowings");
    } catch {
      toast.error("Error saving borrowing data.");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{id ? "Update Borrowing" : "Add New Borrowing"}</h1>
      <div className="form-group">
        <label htmlFor="borrowerName">Borrower Name</label>
        <input
          id="borrowerName"
          name="borrowerName"
          value={borrowing.borrowerName}
          onChange={handleChange}
          placeholder="Enter borrower's name"
          required
        />
      </div>
      {!id && (
        <div className="form-group">
          <label htmlFor="borrowerMail">Borrower Email</label>
          <input
            id="borrowerMail"
            name="borrowerMail"
            value={borrowing.borrowerMail}
            onChange={handleChange}
            placeholder="Enter borrower's email"
            required
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="borrowingDate">Borrowing Date</label>
        <input
          id="borrowingDate"
          name="borrowingDate"
          value={borrowing.borrowingDate}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
          required
        />
      </div>
      {!id && (
        <div className="form-group">
          <label htmlFor="bookForBorrowingRequest">Select Book</label>
          <select
            id="bookForBorrowingRequest"
            name="bookForBorrowingRequest"
            value={borrowing.bookForBorrowingRequest.id}
            onChange={handleChange}
            required
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {id && (
        <div className="form-group">
          <label htmlFor="returnDate">Return Date</label>
          <input
            id="returnDate"
            name="returnDate"
            value={borrowing.returnDate}
            onChange={handleChange}
            placeholder="YYYY-MM-DD (Optional)"
          />
        </div>
      )}
      <button type="submit">{id ? "Update Borrowing" : "Add Borrowing"}</button>
    </form>
  );
};

export default BorrowingForm;
