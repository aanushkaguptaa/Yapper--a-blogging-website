# Blogging Website

## Overview
This project is a blogging website built with Node.js, Express, and MongoDB. It allows users to create, read, and comment on blog posts. The application features user authentication, image uploads to Azure Blob Storage, and a responsive design using Bootstrap.
[Check it out here](https://yapper-a-blogging-website.onrender.com/)

## Features
- **User Authentication**: Users can sign up, sign in, and manage their profiles.
- **Blog Management**: Users can create new blog posts with titles, content, and cover images.
- **Commenting System**: Users can leave comments on blog posts.
- **Responsive Design**: The application is mobile-friendly and uses Bootstrap for styling.
- **Image Uploads**: Images are uploaded to Azure Blob Storage.

## Technologies Used
- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Azure Blob Storage
  - JWT (JSON Web Tokens)

- **Frontend**:
  - EJS (Embedded JavaScript)
  - Bootstrap
  - TinyMCE (WYSIWYG editor)

## Installation

### Prerequisites
- Node.js
- MongoDB
- Azure account for Blob Storage

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project06--blogging-website.git
   cd project06--blogging-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   MONGO_URL=your_mongodb_connection_string
   SECRETENV=your_jwt_secret
   TINY_MCE_API_KEY=your_tiny_mce_api_key
   AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:8080`.

## Usage
- **Sign Up**: Create a new account to start posting blogs.
- **Sign In**: Log in to your account to manage your blogs.
- **Add New Blog**: Use the "ADD AN ENTRY!" link to create a new blog post.
- **View Blogs**: Click on any blog title to read the full post and leave comments.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Acknowledgments
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
- [Bootstrap](https://getbootstrap.com/)
- [TinyMCE](https://www.tiny.cloud/)
