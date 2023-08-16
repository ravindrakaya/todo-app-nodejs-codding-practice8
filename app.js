const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// 1.a) Returns a list of all todos whose status is 'TO DO' API
app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const getTodoQuery = `SELECT * FROM todo
                            WHERE status LIKE "${status}"
                            ORDER BY id;`;
  const todoList = await db.all(getTodoQuery);
  response.send(todoList);
});

// b) Returns a list of all todos whose priority is 'HIGH' API
app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const getPriorityQuery = `SELECT * FROM todo
                              WHERE priority LIKE "${priority}"
                              ORDER BY id;`;
  const priorityList = await db.all(getPriorityQuery);
  response.send(priorityList);
});

// c) Returns a list of all todos whose priority is 'HIGH' and status is 'IN PROGRESS' API
app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const priorityStatusQuery = `SELECT * FROM todo
                                    WHERE priority LIKE "${priority}" AND 
                                    status LIKE "${status}"
                                    ORDER BT id;`;
  const priorityStatusList = await db.all(priorityStatusQuery);
  response.send(priorityStatusList);
});

// d) Returns a list of all todos whose todo contains 'Play' text API
app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const SearchQuery = `SELECT * FROM todo 
                           WHERE todo LIKE "${todo}"
                           ORDER BY id;`;
  const searchList = await db.all(SearchQuery);
  response.send(searchList);
});

// 2. Returns a specific todo based on the todo ID API
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `SELECT * FROM todo 
                          WHERE id = ${todoId};`;
  const todo = await db.get(getTodoQuery);
  response.send(todo);
});

// 3. Create a todo in the todo table
app.post("/todos/", (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status } = todoDetails;
  const createTodoQuery = `INSERT INTO todo
                             (id, todo, priority, status)
                             VALUES (
                                 ${id},"${todo}","${priority}","${status}"
                             );`;
  db.run(createTodoQuery);
  response.send("Todo Successfully Added");
});

// 4a) Updates the details of a specific todo based on the todo ID API
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { status } = todoDetails;
  const updateQuery = `UPDATE todo 
                          SET 
                            status = "${status}"
                            WHERE id = ${todoId};`;
  await db.run(updateQuery);
  response.send("Status Updated");
});

// 4b) API
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { priority } = todoDetails;
  const updateQuery = `UPDATE todo 
                          SET 
                            priority = "${priority}"
                            WHERE id = ${todoId};`;
  await db.run(updateQuery);
  response.send("Priority Updated");
});

// 4c) API
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { todo } = todoDetails;
  const updateQuery = `UPDATE todo 
                          SET 
                            todo = "${todo}"
                            WHERE id = ${todoId};`;
  await db.run(updateQuery);
  response.send("Todo Updated");
});

// 5. Deletes a todo from the todo table based on the todo ID API
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `DELETE FROM todo WHERE id = ${todoId};`;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
