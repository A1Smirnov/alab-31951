# Grades Aggregation API

## Description

This project is a RESTful API for managing student grades, built with Express and MongoDB. It provides various routes for creating, reading, updating, and deleting grade data, as well as for performing aggregated queries.

## Installation

### Requirements

- [Node.js](https://nodejs.org/) (version 14 and above)
- [MongoDB](https://www.mongodb.com/) (local installation or Atlas)

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

   ```plaintext
   ATLAS_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. The API will be available at: `http://localhost:3000`.

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

This project is licensed under the License.

## Contact

If you have any questions, please reach out!
