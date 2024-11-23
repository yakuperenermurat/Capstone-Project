# Library Management System

This project is a full-stack application designed to streamline the management of a library's operations. It enables administrators to manage authors, books, publishers, categories, and borrowings efficiently. With a user-friendly interface and robust backend, the system simplifies everyday library tasks.

## Project Purpose

The goal of this application is to provide an efficient solution for managing library resources. It helps administrators track books, borrowers, and other critical library data seamlessly. By automating processes, the application reduces the administrative burden and ensures an organized library system.

## Live Demo

You can explore the project live at this [Demo Link](https://shimmering-duckanoo-95060e.netlify.app/).

## Features

- **Author Management**: Add, update, delete, and view authors.
- **Book Management**: Track book details such as stock, categories, publishers, and authors.
- **Publisher Management**: Add, edit, and manage publisher details.
- **Category Management**: Categorize books and manage categories effortlessly.
- **Borrowing Records**:
  - Add new borrowings with validation to ensure stock availability.
  - Update borrowing records and manage return dates.
  - View borrowing details with complete borrower and book information.
- **Validation**:
  - Prevent borrowing when stock is empty.
  - Enforce logical date sequences for borrowing and return records.
- **Responsive Design**: Works seamlessly across devices.

## Technologies Used

### Frontend:
- **React**: Dynamic and interactive user interface.
- **CSS**: For elegant and responsive UI design.
- **React Router**: Navigation between different modules.
- **Axios**: Handles API requests seamlessly.
- **Toastify**: Provides real-time feedback for user actions.

### Backend:
- **Spring Boot**: Backend framework for managing API endpoints.
- **Hibernate & JPA**: For database interaction and ORM.
- **MySQL**: Stores application data.
- **Lombok**: Reduces boilerplate code for model classes.
- **Validation**: Ensures proper data integrity with DTOs.

### Deployment:
- **Netlify**: Frontend hosting.
- **Heroku/AWS**: Backend hosting (or mention the platform used).

## Setup and Installation

### Backend:
1. Clone the repository:
   ```bash
   git clone <https://github.com/yakuperenermurat/Capstone-Project.git>
