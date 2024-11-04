# Grades Aggregation API

## Description

This is refactoring original application from https://github.com/A1Smirnov/alab-31941 changing from the standard MongoDB Node driver to Mongoose.

This project is a RESTful API for managing student grades, built with Express and Mongoose. It provides various routes for creating, reading, updating, and deleting grade data, as well as performing aggregated queries. The application interfaces with a MongoDB database, allowing for seamless data management and retrieval.

## Installation

### Requirements

- Node.js (version 14 and above)
- MongoDB (local installation or Atlas)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/grades-aggregation-api.git
   cd grades-aggregation-api
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root of the project and add the following lines:

   ```env
   ATLAS_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. Start the application:

   ```bash
   npm start
   ```

   The API will be available at: [http://localhost:3000](http://localhost:3000).

## Dependencies

This project uses the following key dependencies:

- **dotenv**: ^16.4.5 - A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **express**: ^4.21.1 - A minimal and flexible Node.js web application framework.
- **mongodb**: ^6.10.0 - The official MongoDB driver for Node.js.
- **mongoose**: ^8.8.0 - An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **nodemon**: ^3.1.7 - A utility that monitors for any changes in your source and automatically restarts your server.

Make sure you have these dependencies installed in your local environment.

## Routes

### Main Routes

- `GET /` - Welcome to the API.

### Grades

- `GET /grades` - Get all grades.
- `GET /grades/:id` - Get a grade by ID.
- `POST /grades` - Create a new grade.
- `PATCH /grades/:id/add` - Add a grade to an existing record.
- `PATCH /grades/:id/remove` - Remove a grade from an existing record.
- `DELETE /grades/:id` - Delete a grade by ID.
- `DELETE /grades/learner/:id` - Delete all grades for a student.
- `DELETE /grades/class/:id` - Delete all grades for a class.

### Aggregated Routes

- `GET /grades/stats` - Get statistics on grades.
- `GET /grades/learner/:id/avg-class` - Get the average grade for a student by classes.
- `GET /grades/learner/:id/class/average` - Get the average grade for a student across all classes.
- `GET /grades/stats/:id` - Get statistics for a specific class by ID.

## Example Requests

### Create a Grade

```bash
curl -X POST http://localhost:3000/grades -H "Content-Type: application/json" -d '{
  "class_id": 101,
  "learner_id": 1,
  "scores": [
    { "type": "exam", "score": 85 },
    { "type": "quiz", "score": 90 },
    { "type": "homework", "score": 78 }
  ]
}'
```

### Get Statistics

```bash
curl http://localhost:3000/grades/stats
```

## Contribution

If you would like to contribute to the project, please create an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions, please reach out to me