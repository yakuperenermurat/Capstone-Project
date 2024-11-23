import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const PublisherList = () => {
  const [publishers, setPublishers] = useState([]);
  const [selectedPublisherId, setSelectedPublisherId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      const response = await api.get('/publishers');
      setPublishers(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching publishers");
      toast.error("Error fetching publishers");
    }
  };

  const deletePublisher = async (id) => {
    try {
      await api.delete(`/publishers/${id}`);
      fetchPublishers();
      toast.success("Publisher deleted successfully!");
    } catch (err) {
      toast.error("Error deleting publisher");
    }
  };

  const toggleDetails = (id) => {
    setSelectedPublisherId(selectedPublisherId === id ? null : id);
  };

  return (
    <div className="page-content">
      <h1>Publishers</h1>
      {error && <div className="error">{error}</div>}
      <Link to="/publishers/new">
        <button className="add-btn">Add New Publisher</button>
      </Link>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Establishment Year</th>
              <th>Address</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((publisher) => (
              <React.Fragment key={publisher.id}>
                <tr>
                  <td>{publisher.id}</td>
                  <td>{publisher.name}</td>
                  <td>{publisher.establishmentYear}</td>
                  <td>{publisher.address}</td>
                  <td className="actions">
                    <button
                      className="view-btn"
                      onClick={() => toggleDetails(publisher.id)}
                    >
                      {selectedPublisherId === publisher.id ? "Hide" : "View"}
                    </button>
                    <Link to={`/publishers/edit/${publisher.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => deletePublisher(publisher.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {selectedPublisherId === publisher.id && (
                  <tr className="details-row">
                    <td colSpan="5">
                      <div className="details">
                        <h3>Publisher Details</h3>
                        <p><strong>ID:</strong> {publisher.id}</p>
                        <p><strong>Name:</strong> {publisher.name}</p>
                        <p><strong>Establishment Year:</strong> {publisher.establishmentYear}</p>
                        <p><strong>Address:</strong> {publisher.address}</p>
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

export default PublisherList;
