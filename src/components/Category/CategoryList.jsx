import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching categories");
      toast.error("Error fetching categories");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (err) {
      toast.error("Error deleting category");
    }
  };

  const toggleDetails = (id) => {
    setSelectedCategoryId(selectedCategoryId === id ? null : id);
  };

  return (
    <div className="page-content">
      <h1>Categories</h1>
      {error && <div className="error">{error}</div>}
      <Link to="/categories/new">
        <button className="add-btn">Add New Category</button>
      </Link>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <tr>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td className="actions">
                    <button
                      className="view-btn"
                      onClick={() => toggleDetails(category.id)}
                    >
                      {selectedCategoryId === category.id ? "Hide" : "View"}
                    </button>
                    <Link to={`/categories/edit/${category.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => deleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {selectedCategoryId === category.id && (
                  <tr className="details-row">
                    <td colSpan="4">
                      <div className="details">
                        <h3>Category Details</h3>
                        <p><strong>ID:</strong> {category.id}</p>
                        <p><strong>Name:</strong> {category.name}</p>
                        <p><strong>Description:</strong> {category.description}</p>
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

export default CategoryList;
