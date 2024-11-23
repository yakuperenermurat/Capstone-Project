import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const BorrowingForm = () => {
  const [borrowing, setBorrowing] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: "",
    bookForBorrowingRequest: { id: "" },
    returnDate: "",
  });
  const [books, setBooks] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      fetchBooks();
    }
    if (id) {
      fetchBorrowing();
    }
  }, [id]);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
    } catch {
      toast.error("Error fetching books.");
    }
  };

  const fetchBorrowing = async () => {
    try {
      const response = await api.get(`/borrows/${id}`);
      setBorrowing({
        borrowerName: response.data.borrowerName || "",
        borrowingDate: response.data.borrowingDate || "",
        returnDate: response.data.returnDate || "",
        bookForBorrowingRequest: {
          id: response.data.book?.id || "",
        },
      });
    } catch {
      toast.error("Error fetching borrowing data.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bookForBorrowingRequest") {
      setBorrowing((prev) => ({
        ...prev,
        bookForBorrowingRequest: { id: value },
      }));
    } else {
      setBorrowing((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const borrowingData = {
        borrowerName: borrowing.borrowerName,
        borrowingDate: borrowing.borrowingDate,
        returnDate: borrowing.returnDate || null,
        ...(id ? {} : { borrowerMail: borrowing.borrowerMail }),
        bookForBorrowingRequest: id
          ? undefined
          : { id: parseInt(borrowing.bookForBorrowingRequest.id, 10) },
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
