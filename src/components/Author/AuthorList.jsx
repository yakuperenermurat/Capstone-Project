import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null); // View için
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors');
      setAuthors(response.data);
    } catch {
      setError("Error fetching authors");
    }
  };

  const deleteAuthor = async (id) => {
    try {
      await api.delete(`/authors/${id}`);
      toast.success("Author deleted successfully!");
      fetchAuthors();
    } catch {
      toast.error("Error deleting author.");
    }
  };

  const toggleDetails = (id) => {
    setSelectedAuthorId(selectedAuthorId === id ? null : id); // Açık/kapalı durumu
  };

  return (
    <div className="table-container">
      <h1>Authors</h1>
      <Link to="/authors/new">
        <button className="add-btn">Add New Author</button>
      </Link>
      {error && <p className="error">{error}</p>}
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
              <tr>
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.country}</td>
                <td>{author.birthDate}</td>
                <td className="actions">
                  <button onClick={() => toggleDetails(author.id)} className="view-btn">
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
