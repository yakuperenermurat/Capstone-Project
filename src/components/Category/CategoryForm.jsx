import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const CategoryForm = () => {
  // State to manage category form data
  const [category, setCategory] = useState({
    name: "",  // Name of the category
    description: "",  // Description of the category
  });

  // Hook to get the `id` parameter from the URL (used for edit mode)
  const { id } = useParams();
  // Hook to navigate programmatically
  const navigate = useNavigate();

   // Fetch category data if `id` exists (edit mode)
  useEffect(() => {
    if (id) {
      api
        .get(`/categories/${id}`) // Fetch the category details by ID
        .then((response) => setCategory(response.data)) // Populate the form with existing data
        .catch(() => toast.error("Error fetching category data.")); // Show error if data fetch fails
    }
  }, [id]);

  // Handle input changes in the form
  const handleChange = (e) => {
    // Update the corresponding field in the state
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior (page reload)
    try {
      if (id) {
        // If `id` exists, update the category
        await api.put(`/categories/${id}`, category); // API call to update the category
        toast.success("Category updated successfully!"); // Show success notification 
      } else {
        // If `id` does not exist, create a new category
        await api.post("/categories", category);  // API call to create a new category
        toast.success("Category added successfully!");  // Show success notification
      }
      navigate("/categories");  // Redirect to the categories list page
    } catch {
      toast.error("Error saving category data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{id ? "Update Category" : "Add New Category"}</h1>
      {/* Name Input Field */}
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
      {/* Description Input Field */}
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
      {/* Submit Button */}
      <button type="submit">{id ? "Update Category" : "Add Category"}</button>
    </form>
  );
};

export default CategoryForm;
