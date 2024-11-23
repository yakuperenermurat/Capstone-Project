import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const AuthorForm = () => {
  const [author, setAuthor] = useState({ name: "", birthDate: "", country: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api
        .get(`/authors/${id}`)
        .then((response) => setAuthor(response.data))
        .catch(() => toast.error("Error fetching author data."));
    }
  }, [id]);

  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/authors/${id}`, author);
        toast.success("Author updated successfully!");
      } else {
        await api.post("/authors", author);
        toast.success("Author added successfully!");
      }
      navigate("/authors");
    } catch {
      toast.error("Error saving author data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{id ? "Update Author" : "Add New Author"}</h1>
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
      <button type="submit">{id ? "Update Author" : "Add Author"}</button>
    </form>
  );
};

export default AuthorForm;
