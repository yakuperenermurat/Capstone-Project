import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const AuthorForm = () => {
  // State to manage author data
  const [author, setAuthor] = useState({ name: "", birthDate: "", country: "" });
  // Retrieve the ID parameter from the URL
  const { id } = useParams();
  // Navigate object to redirect to another route
  const navigate = useNavigate();

  // Fetch author data if ID is present (Edit Mode)
  useEffect(() => {
    if (id) {
      api
        .get(`/authors/${id}`)  // API call to get the author by ID
        .then((response) => setAuthor(response.data))  // Populate the form with existing data
        .catch(() => toast.error("Error fetching author data.")); // Show error toast if fetching fails
    }
  }, [id]); // Dependency array ensures this effect runs only when the `id` changes

  // Handle changes in form fields
  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value }); // Update state with the input field's value
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    try {
      if (id) {
        // If ID exists, update the author
        await api.put(`/authors/${id}`, author);  // PUT request to update author data
        toast.success("Author updated successfully!"); // Show success message
      } else {
        // If no ID, create a new author
        await api.post("/authors", author);  // POST request to create new author
        toast.success("Author added successfully!");  // Show success message
      }
      navigate("/authors");  // Redirect to the authors list
    } catch {
      toast.error("Error saving author data.");  // Show error message if something goes wrong
    }
  };

  return (
    // Form for adding or updating author information
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{id ? "Update Author" : "Add New Author"}</h1>
      {/* Name field */}
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={author.name}
          onChange={handleChange}
          placeholder="Enter author's name"
          required
        />
      </div>
      {/* Birth Date field */}
      <div className="form-group">
        <label htmlFor="birthDate">Birth Date</label>
        <input
          id="birthDate"
          name="birthDate"
          value={author.birthDate}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
          required
        />
      </div>
      {/* Country field */}
      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input
          id="country"
          name="country"
          value={author.country}
          onChange={handleChange}
          placeholder="Enter author's country"
          required
        />
      </div>
      {/* Submit button */}
      <button type="submit">{id ? "Update Author" : "Add Author"}</button>
    </form>
  );
};

export default AuthorForm;
