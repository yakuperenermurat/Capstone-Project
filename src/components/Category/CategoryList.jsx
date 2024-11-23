import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { toast } from 'react-toastify';

const CategoryList = () => {
  // State to store the list of categories
  const [categories, setCategories] = useState([]);
  // State to track which category's details are currently selected (for "View" functionality)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // State to track errors
  const [error, setError] = useState("");
// Fetch categories when the component is mounted
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to fetch the list of categories from the API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories'); // API call to get categories
      setCategories(response.data);  // Set the categories data in the state
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Error fetching categories"); // Set an error message in case of failure
      toast.error("Error fetching categories"); // Show an error notification
    }
  };
 
  // Function to delete a category by ID
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`); // API call to delete the category
      fetchCategories();  // Refresh the categories list after deletion
      toast.success("Category deleted successfully!");   // Show a success notification
    } catch (err) {
      toast.error("Error deleting category"); // Show an error notification
    }
  };
 // Function to toggle the "View" state of category details
  const toggleDetails = (id) => {
    // If the same category is clicked again, close the details view
    setSelectedCategoryId(selectedCategoryId === id ? null : id);
  };

  return (
    <div className="page-content">
      {/* Page heading */}
      <h1>Categories</h1>
      {/* Display an error message if there's an error */}
      {error && <div className="error">{error}</div>}
      {/* Button to navigate to the "Add New Category" form */}
      <Link to="/categories/new">
        <button className="add-btn">Add New Category</button>
      </Link>
      {/* Table to display the list of categories */}
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
            {/* Map over the categories to create table rows */}
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
                 {/* Display the category details if it's selected */}
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
