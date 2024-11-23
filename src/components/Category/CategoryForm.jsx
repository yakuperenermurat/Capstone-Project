import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const CategoryForm = () => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api
        .get(`/categories/${id}`)
        .then((response) => setCategory(response.data))
        .catch(() => toast.error("Error fetching category data."));
    }
  }, [id]);

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/categories/${id}`, category);
        toast.success("Category updated successfully!");
      } else {
        await api.post("/categories", category);
        toast.success("Category added successfully!");
      }
      navigate("/categories");
    } catch {
      toast.error("Error saving category data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{id ? "Update Category" : "Add New Category"}</h1>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={category.name}
          onChange={handleChange}
          placeholder="Enter category name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          value={category.description}
          onChange={handleChange}
          placeholder="Enter category description"
          required
        />
      </div>
      <button type="submit">{id ? "Update Category" : "Add Category"}</button>
    </form>
  );
};

export default CategoryForm;
