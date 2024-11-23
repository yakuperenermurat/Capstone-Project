import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const PublisherForm = () => {
  const [publisher, setPublisher] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api
        .get(`/publishers/${id}`)
        .then((response) => setPublisher(response.data))
        .catch(() => toast.error("Error fetching publisher data."));
    }
  }, [id]);

  const handleChange = (e) => {
    setPublisher({ ...publisher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/publishers/${id}`, publisher);
        toast.success("Publisher updated successfully!");
      } else {
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
      <h1>{id ? "Update Publisher" : "Add New Publisher"}</h1>
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
      <button type="submit">{id ? "Update Publisher" : "Add Publisher"}</button>
    </form>
  );
};

export default PublisherForm;
