# Averroes Image Management App

This is a simple image management application built with Next.js. Users can upload images, view categories, and perform basic image and category management. This application also demonstrates the use of API interactions, file uploads, and basic CRUD operations.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [License](#license)

## Technologies

- **Next.js** - React framework for production
- **Material UI** - React UI framework for building user interfaces
- **Axios** - Promise-based HTTP client for API requests
- **React Query** - For server-state management
- **React Hooks** - Custom hooks for data fetching

## Features

- Image Upload with Category Selection
- Display Images in a Grid
- Edit Image Information (Name, Category)
- Delete Images
- Fetch Categories from a remote API
- Responsive Design

## Folder Structure

```plaintext
src
|   404.js               # Custom 404 page
|
+---api                  # API utilities for interacting with the backend
|       api.js
|
+---app                  # Main application and page structure
|   |   favicon.ico
|   |   globals.css
|   |   layout.js        # Layout for the app
|   |   page.js          # Home page, redirects to the image page
|   |   page.module.css  # Global CSS styles
|   |
|   +---categories       # Category-related pages
|   |   |   page.js      # List all categories
|   |   \---[id]         # Dynamic routes for categories
|   |           page.jsx
|   |
|   +---fonts            # Custom font files
|   |       GeistMonoVF.woff
|   |       GeistVF.woff
|   |
|   \---images           # Image-related pages
|           page.js      # Image gallery page
|           upload.js    # Image upload page
|
+---components           # Reusable React components
|       EditModal.jsx    # Modal for editing images
|       Filter.jsx       # Filter component for searching images
|       ImageCard.jsx    # Card component to display image details
|       ImageUpload.jsx  # Component to upload images
|       Navbar.jsx       # Navigation bar
|
\---hooks                # Custom hooks for data fetching
        useCategories.js # Hook to fetch categories
```
