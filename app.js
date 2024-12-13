const express = require("express");
const admin = require("./firebase"); // Import the Firebase Admin SDK initialization
const jwt=require('jsonwebtoken');
const app = express();
const cors = require("cors");
app.use(express.json()); // For parsing JSON data
app.use(cors());

//Login and generate the token key for authentication
app.post("/login", async (req, res) => {
  const { userid } = req.body;
  const token_key = "ToDo_App";
  try {
    if (userid) {
      const token = await jwt.sign({ userId: userid }, token_key, {expiresIn: "1h"});
      res.send(token);
    } else {
      res.status(400).send("user id is required");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Verify token key for authentication
const verifyToken = async (req, res, next) => {
  try {
      const token=req.headers.token;
      if(!token){
         return res.status(403).send("token is required");
      }
      try {
        await jwt.verify(token,"ToDo_App");
      } catch (err) {
        return res.status(401).send(error.message);
      }
      return next();

  } catch (error) {
    res.status(400).send(error.message);
  }
};

//Add Todo task
app.post("/addTodos",verifyToken, async (req, res) => {
  try {
    const docRef = await admin.firestore().collection("todo_Data").add({
      userid: req.body.userid,
      task: req.body.task,
      isCompleted: req.body.isCompleted,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Save the current timestamp
    });
    res.status(201).send({ message: "Task added", id: docRef.id });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding task", error: error.message });
  }
});

//Delete todo task
app.post("/deleteTodo",verifyToken, async (req, res) => {
  try {
    const taskDoc = await admin.firestore().collection("todo_Data").doc(req.body.taskid).get();
    if (!taskDoc.exists) {
      return res.status(404).send("Task not found or not authorized");
    }
    await admin.firestore().collection("todo_Data").doc(req.body.taskid).delete();
    res.status(200).send("Task deleted successfully");
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding task", error: error.message });
  }
});

//Fetch todo task
app.get("/getAllTodos",verifyToken, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("todo_Data").get();
    let records = [];
    snapshot.docs.forEach((item) => {
      const todoData = {};
      if (req.headers.userid.toString() === item.data().userid.toString()) {
        todoData.userid = item.data().userid;
        todoData.task = item.data().task;
        todoData.isCompleted = item.data().isCompleted;
        todoData.taskid = item.id;
        records.push(todoData);
      }
    });

    res.status(200).json(records);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching all todos", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
