import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const PublisherForm = () => {
  // State to store the publisher data
  const [publisher, setPublisher] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  });
  // Get the ID from the route parameters (used for editing an existing publisher)
  const { id } = useParams();
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Fetch the publisher details when editing an existing publisher
  useEffect(() => {
    if (id) {
      api
        .get(`/publishers/${id}`)
        .then((response) => setPublisher(response.data))
        .catch(() => toast.error("Error fetching publisher data."));
    }
  }, [id]);

  // Handle changes in form inputs and update the state
  const handleChange = (e) => {
    setPublisher({ ...publisher, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding or updating a publisher
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update an existing publisher
        await api.put(`/publishers/${id}`, publisher);
        toast.success("Publisher updated successfully!");
      } else {
        // Add a new publisher
        await api.post("/publishers", publisher);
        toast.success("Publisher added successfully!");
      }
      navigate("/publishers");
    } catch {
      toast.error("Error saving publisher data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Form heading */}
      <h1>{id ? "Update Publisher" : "Add New Publisher"}</h1>
      {/* Form field for publisher's name */}
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={publisher.name}
          onChange={handleChange}
          placeholder="Enter publisher name"
          required
        />
      </div>
      {/* Form field for establishment year */}
      <div className="form-group">
        <label htmlFor="establishmentYear">Establishment Year</label>
        <input
          id="establishmentYear"
          name="establishmentYear"
          value={publisher.establishmentYear}
          onChange={handleChange}
          placeholder="YYYY"
          required
        />
      </div>
      {/* Form field for publisher's address */}
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          value={publisher.address}
          onChange={handleChange}
          placeholder="Enter publisher address"
          required
        />
      </div>
      {/* Submit button */}
      <button type="submit">{id ? "Update Publisher" : "Add Publisher"}</button>
    </form>
  );
};

export default PublisherForm;
