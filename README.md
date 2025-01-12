# Encrypted User Authentication API

This is a Node.js-based API that provides secure user authentication with AES-256-CBC encryption. The API includes endpoints for user sign-up and login, ensuring sensitive user data is encrypted before being stored.

## Features

- **AES-256-CBC Encryption**: All user data is encrypted for secure storage.
- **Persistent Encryption Key**: A single encryption key is used, stored securely in a local file.
- **Input Validation**: Ensures all required fields are present during sign-up and login.
- **Error Handling**: Provides detailed error messages for common issues like missing fields, duplicate users, or invalid credentials.

## Requirements

- [Node.js](https://nodejs.org/) (v12 or later)
- [NPM](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Start the Server

Run the following command to start the server:
```bash
node <filename.js>
```
By default, the server will run at `http://localhost:3000/`.

### Endpoints

#### 1. **Sign-Up**

**POST** `/signup`

Registers a new user by encrypting their information and saving it in a JSON database.

- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "password": "securePassword123"
  }
  ```

- **Response**:
  - Success:
    ```json
    {
      "message": "Sign-Up Successful! Data has been securely stored."
    }
    ```
  - Failure (e.g., missing fields):
    ```json
    {
      "message": "All fields are required."
    }
    ```
  - Failure (e.g., user already exists):
    ```json
    {
      "message": "User already exists with this email or phone number."
    }
    ```

#### 2. **Login**

**POST** `/login`

Validates user credentials and returns decrypted user data upon success.

- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
  OR
  ```json
  {
    "phone": "1234567890",
    "password": "securePassword123"
  }
  ```

- **Response**:
  - Success:
    ```json
    {
      "message": "Login Successful!",
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
    ```
  - Failure (e.g., invalid credentials):
    ```json
    {
      "message": "Invalid credentials!"
    }
    ```
  - Failure (e.g., user not found):
    ```json
    {
      "message": "User not found!"
    }
    ```

## File Structure

- `encryption_key.txt`: Stores the encryption key.
- `database.json`: Stores encrypted user data.
- `public/`: Directory for static files (if needed).

## How It Works

1. **Encryption**:
   - User data is encrypted using AES-256-CBC with a randomly generated Initialization Vector (IV).
   - The IV is stored along with the encrypted data.

2. **Decryption**:
   - During login, the encrypted data is decrypted using the stored encryption key and the IV from the data.

3. **Persistent Storage**:
   - User data is stored in a JSON file (`database.json`) for simplicity. This can be replaced with a database for production use.

## Security Considerations

- The encryption key is stored locally in `encryption_key.txt`. Ensure this file is protected and not exposed.
- Always validate user input to prevent security vulnerabilities like SQL Injection or XSS (although not applicable in this setup).
- Use HTTPS in production to secure data in transit.

## Development Notes

- Logs sensitive data to the console for debugging purposes. Remove or secure these logs in production.
- The database is a simple JSON file. Consider using a database like MongoDB or PostgreSQL for scalability and security.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

