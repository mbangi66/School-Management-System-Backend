# School Management System

## Overview

This School Management System is a web application built using Node.js and SQLite, designed to manage student data efficiently. It includes features such as user authentication, student CRUD operations, and dynamic filtering.

## Getting Started

### Prerequisites

- Node.js installed
- SQLite database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/school-management-system.git
Install dependencies:

cd school-management-system
npm install

Set up the SQLite database:

Ensure you have SQLite installed
Run the following command in the project directory:
sqlite3 database.db < schema.sql

Start the application:

npm start

Features
User Authentication: Secure endpoints using token-based authentication.

Student CRUD Operations:

Add new students
Update existing student details
Delete students
Dynamic Filtering:

Filter students by primary or secondary, year, and class number
Protected Route:

/protected route requiring authentication
API Endpoints
* GET /students: Retrieve all students from the database.

* POST /students: Add a new student to the database.

* PUT /students/:id: Update an existing student's details.

* DELETE /students/:id: Delete a student from the database.

* GET /filtered-students: Endpoint for filtering students based on criteria.

* GET /protected: Protected route requiring authentication.

User Routes:

* /users/check-username: Check if a username is available.
* /users/register: Register a new user.
* /users/login: Authenticate user login.
Usage
Access the application at http://localhost:3000.
Explore different endpoints and functionalities.
Contributing
Feel free to contribute to the project by opening issues or submitting pull requests. Your feedback and contributions are highly appreciated!
