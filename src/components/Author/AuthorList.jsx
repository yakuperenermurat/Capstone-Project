import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const AuthorList = () => {
  // State to manage the list of authors
  const [authors, setAuthors] = useState([]);
  // State to track the selected author's ID for viewing details
  const [selectedAuthorId, setSelectedAuthorId] = useState(null); // View için
  // State to store any error messages
  const [error, setError] = useState("");

  // Fetch authors when the component mounts
  useEffect(() => {
    fetchAuthors();
  }, []);

  // Function to fetch all authors from the backend
  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors');  // API call to get authors
      setAuthors(response.data);  // Update state with fetched authors
    } catch {
      setError("Error fetching authors");  // Display error if fetching fails
    }
  };

  // Function to delete an author by ID
  const deleteAuthor = async (id) => {
    try {
      await api.delete(`/authors/${id}`); // API call to delete an author
      toast.success("Author deleted successfully!");  // Show success toast
      fetchAuthors();  // Refresh the list of authors
    } catch {
      toast.error("Error deleting author.");  // Show error toast if deletion fails
    }
  };

  // Function to toggle the details view of a specific author
  const toggleDetails = (id) => {
    // If the ID is already selected, deselect it; otherwise, set it as selected
    setSelectedAuthorId(selectedAuthorId === id ? null : id); // Açık/kapalı durumu
  };

  return (
    <div className="table-container">
      <h1>Authors</h1>
      {/* Button to navigate to the form for adding a new author */}
      <Link to="/authors/new">
        <button className="add-btn">Add New Author</button>
      </Link>
      {/* Display error message if there is an issue */}
      {error && <p className="error">{error}</p>}
      {/* Table to display the list of authors */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>Birth Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <React.Fragment key={author.id}>
              {/* Main row showing author details */}
              <tr>
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.country}</td>
                <td>{author.birthDate}</td>
                <td className="actions">
                  {/* Button to toggle details view */}
                  <button onClick={() => toggleDetails(author.id)} className="view-btn">
                    {/* Additional row to display author details when selected */}
                    {selectedAuthorId === author.id ? "Hide" : "View"}
                  </button>
                  <Link to={`/authors/edit/${author.id}`} className="edit-btn">Edit</Link>
                  <button onClick={() => deleteAuthor(author.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
              {/* Detaylar */}
              {selectedAuthorId === author.id && (
                <tr className="details-row">
                  <td colSpan="5" className="details">
                    <h3>Author Details</h3>
                    <p><strong>ID:</strong> {author.id}</p>
                    <p><strong>Name:</strong> {author.name}</p>
                    <p><strong>Birth Date:</strong> {author.birthDate}</p>
                    <p><strong>Country:</strong> {author.country}</p>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorList;
