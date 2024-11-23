import React, { useEffect, useState } from 'react';
import { api } from '../api/api';

const Home = () => {
  const [dataCounts, setDataCounts] = useState({
    authors: 0,
    books: 0,
    publishers: 0,
    categories: 0,
    borrowings: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [authors, books, publishers, categories, borrowings] = await Promise.all([
          api.get('/authors'),
          api.get('/books'),
          api.get('/publishers'),
          api.get('/categories'),
          api.get('/borrows'),
        ]);

        setDataCounts({
          authors: authors.data.length,
          books: books.data.length,
          publishers: publishers.data.length,
          categories: categories.data.length,
          borrowings: borrowings.data.length,
        });
      } catch (err) {
        console.error('Error fetching data counts:', err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="page-content">
      <h1>Welcome to the Library Management System</h1>
      <ul className="list-container">
        <li>Authors: {dataCounts.authors}</li>
        <li>Books: {dataCounts.books}</li>
        <li>Publishers: {dataCounts.publishers}</li>
        <li>Categories: {dataCounts.categories}</li>
        <li>Borrowings: {dataCounts.borrowings}</li>
      </ul>
    </div>
  );
};

export default Home;
