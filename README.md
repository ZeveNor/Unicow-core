# Unicow-core

Unicow-core is a Node.js-based application designed to streamline development with key dependencies such as Express, Firebase, and PostgreSQL. This guide will walk you through setting up the project for development.

## Prerequisites

Ensure the following prerequisites are met before setting up the project:

- **Node.js** version: v20.17.0  
- **npm** (Node Package Manager)

If you do not have the required Node.js version, you can manage it using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm):

```
nvm install 20.17.0  
nvm use 20.17.0
```

## Installation

1. Clone the repository:  
  ```
   git clone https://github.com/your-username/unicow-core.git  
   cd unicow-core
  ```
3. Install the required dependencies:  
  ```
    npm install
  ```
## Running in Development Mode

To run the project in development mode using nodemon:
```
nodemon index.js
```

## Required Dependencies

This project relies on the following npm packages:
----------------------------------------------------------------------------------
| Package   | Version        | Description                                       |
| --------- | -------------- | ------------------------------------------------- |
| dotenv    | ^16.4.5        | Loads environment variables from `.env` file      |
| express   | ^4.19.2        | Web framework for Node.js                         |
| firebase  | ^10.14.0       | Firebase integration for authentication and DB    |
| multer    | ^1.4.5-lts.1   | Middleware for handling file uploads              |
| nodemon   | ^3.1.7         | Auto-restarts Node.js server upon file changes    |
| pg        | ^8.12.0        | PostgreSQL client for Node.js                     |

----------------------------------------------------------------------------------

### Installing Dependencies

To install all required dependencies, run:

```
npm install dotenv@^16.4.5 express@^4.19.2 firebase@^10.14.0 multer@^1.4.5-lts.1 nodemon@^3.1.7 pg@^8.12.0
```

## Usage

Once all dependencies are installed, you can start the development server by running:

```
nvm use 20.17.0  
nodemon index.js
```

