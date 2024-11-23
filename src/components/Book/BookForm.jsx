import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const BookForm = () => {
  // State to manage the book details
  const [book, setBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    authorId: "",
    categoryIds: [], // Array to store selected categories
    publisherId: "",
  });

  // States to store dropdown data for authors, categories, and publishers
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);

  // Get the `id` parameter from the URL and set up navigation
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data when the component is mounted or when `id` changes
  useEffect(() => {
    fetchDropdownData(); // Fetch authors, categories, and publishers
    if (id) fetchBook(); // Fetch the book details if editing
  }, [id]);

  // Fetch dropdown data for authors, categories, and publishers
  const fetchDropdownData = async () => {
    try {
      const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
        api.get("/authors"),  // API call to fetch authors
        api.get("/categories"),  // API call to fetch categories
        api.get("/publishers"),  // API call to fetch publishers
      ]);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
      setPublishers(publishersRes.data);
    } catch {
      toast.error("Error fetching dropdown data.");  // Error handling
    }
  };

  // Fetch the book details for editing
  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`);  // API call to fetch the book
      setBook({
        name: response.data.name,
        publicationYear: response.data.publicationYear,
        stock: response.data.stock,
        authorId: response.data.author?.id || "",
        categoryIds: response.data.categories?.map((cat) => cat.id) || [],
        publisherId: response.data.publisher?.id || "",
      });
    } catch {
      toast.error("Error fetching book data.");  // Error handling
    }
  };

   // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle multiple selection for categories
    if (name === "categoryIds") {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => parseInt(option.value, 10)
      );
      setBook((prev) => ({ ...prev, categoryIds: selectedOptions }));
    } else {
      // Handle other inputs
      setBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the book data object for the API request
      const bookData = {
        name: book.name,
        publicationYear: book.publicationYear,
        stock: book.stock,
        author: { id: parseInt(book.authorId, 10) }, // Include the author's ID
        publisher: { id: parseInt(book.publisherId, 10) }, // Include the publisher's ID
        categories: book.categoryIds.map((id) => ({ id })), // Map category IDs to objects
      };

       // Update an existing book
      if (id) {
        await api.put(`/books/${id}`, bookData);
        toast.success("Book updated successfully!"); // Success toast
      } else {
        // Add a new book
        await api.post("/books", bookData);
        toast.success("Book added successfully!"); // Success toast
      }
      navigate("/books");
    } catch {
      toast.error("Error saving book data.");
      // Error handling
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{id ? "Update Book" : "Add New Book"}</h1>
      {/* Input for book name */}
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={book.name}
          onChange={handleChange}
          placeholder="Enter book name"
          required
        />
      </div>
      {/* Input for publication year */}
      <div className="form-group">
        <label htmlFor="publicationYear">Publication Year</label>
        <input
          id="publicationYear"
          name="publicationYear"
          value={book.publicationYear}
          onChange={handleChange}
          placeholder="YYYY"
          required
        />
      </div>
       {/* Input for stock */}
      <div className="form-group">
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          name="stock"
          value={book.stock}
          onChange={handleChange}
          placeholder="Enter stock amount"
          required
        />
      </div>
      {/* Dropdown for selecting an author */}
      <div className="form-group">
        <label htmlFor="authorId">Author</label>
        <select
          id="authorId"
          name="authorId"
          value={book.authorId}
          onChange={handleChange}
          required
        >
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>
      {/* Dropdown for selecting categories */}
      <div className="form-group">
        <label htmlFor="categoryIds">Categories</label>
        <select
          id="categoryIds"
          name="categoryIds"
          value={book.categoryIds}
          onChange={handleChange}
          multiple
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {/* Dropdown for selecting a publisher */}
      <div className="form-group">
        <label htmlFor="publisherId">Publisher</label>
        <select
          id="publisherId"
          name="publisherId"
          value={book.publisherId}
          onChange={handleChange}
          required
        >
          <option value="">Select Publisher</option>
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </option>
          ))}
        </select>
      </div>
      {/* Submit button */}
      <button type="submit">{id ? "Update Book" : "Add Book"}</button>
    </form>
  );
};

export default BookForm;
