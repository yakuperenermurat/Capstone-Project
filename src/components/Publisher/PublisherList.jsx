import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const PublisherList = () => {
  // State to store the list of publishers
  const [publishers, setPublishers] = useState([]);
  // State to track which publisher's details are being toggled
  const [selectedPublisherId, setSelectedPublisherId] = useState(null);
  // State to handle and display errors
  const [error, setError] = useState("");

  // Fetch publishers when the component is mounted
  useEffect(() => {
    fetchPublishers();
  }, []);

  // Function to fetch the list of publishers from the backend
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
// Function to delete a publisher by ID
  const deletePublisher = async (id) => {
    try {
      await api.delete(`/publishers/${id}`);
      fetchPublishers();
      toast.success("Publisher deleted successfully!");
    } catch (err) {
      toast.error("Error deleting publisher");
    }
  };

  // Function to toggle the visibility of publisher details
  const toggleDetails = (id) => {
    setSelectedPublisherId(selectedPublisherId === id ? null : id);
  };

  return (
    <div className="page-content">
      {/* Page heading */}
      <h1>Publishers</h1>
      {/* Display error message if any */}
      {error && <div className="error">{error}</div>}
      {/* Button to add a new publisher */}
      <Link to="/publishers/new">
        <button className="add-btn">Add New Publisher</button>
      </Link>
      {/* Table displaying the list of publishers */}
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
                {/* Details row: Display additional information for the selected publisher */}
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
