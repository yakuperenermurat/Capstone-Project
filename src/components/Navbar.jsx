import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/publishers">Publishers</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/authors">Authors</Link></li>
        <li><Link to="/borrowings">Borrowings</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
