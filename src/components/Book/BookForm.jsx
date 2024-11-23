import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const BookForm = () => {
  const [book, setBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    authorId: "",
    categoryIds: [],
    publisherId: "",
  });
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDropdownData();
    if (id) fetchBook();
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
        api.get("/authors"),
        api.get("/categories"),
        api.get("/publishers"),
      ]);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
      setPublishers(publishersRes.data);
    } catch {
      toast.error("Error fetching dropdown data.");
    }
  };

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`);
      setBook({
        name: response.data.name,
        publicationYear: response.data.publicationYear,
        stock: response.data.stock,
        authorId: response.data.author?.id || "",
        categoryIds: response.data.categories?.map((cat) => cat.id) || [],
        publisherId: response.data.publisher?.id || "",
      });
    } catch {
      toast.error("Error fetching book data.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryIds") {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => parseInt(option.value, 10)
      );
      setBook((prev) => ({ ...prev, categoryIds: selectedOptions }));
    } else {
      setBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        name: book.name,
        publicationYear: book.publicationYear,
        stock: book.stock,
        author: { id: parseInt(book.authorId, 10) },
        publisher: { id: parseInt(book.publisherId, 10) },
        categories: book.categoryIds.map((id) => ({ id })),
      };

      if (id) {
        await api.put(`/books/${id}`, bookData);
        toast.success("Book updated successfully!");
      } else {
        await api.post("/books", bookData);
        toast.success("Book added successfully!");
      }
      navigate("/books");
    } catch {
      toast.error("Error saving book data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{id ? "Update Book" : "Add New Book"}</h1>
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
      <button type="submit">{id ? "Update Book" : "Add Book"}</button>
    </form>
  );
};

export default BookForm;
