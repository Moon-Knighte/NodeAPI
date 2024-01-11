const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./models/userModel");
const app = express();

const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//fetch all data from the database
app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//fetch single data from the database
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const users = await userModel.findById(id);
    res.status(200).json(users);
  } catch (error) {
    console.log("Failed to fetch user", error);
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndUpdate(id, req.body);
    if (!user) return res.status(404).json({ message: "User ID not found" });

    //save updated user
    const updatedUser = await userModel.findById(id);
    res.status(200).json(updatedUser);

    return res.status(200).json(user);
  } catch (error) {
    console.log("Failed to update user", error);
  }
});

//create and save a new user in the database
app.post("/users", async (req, res) => {
  try {
    const users = await userModel.create(req.body);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//delete a user from the database
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res
        .status(200)
        .json({ message: "User deleted successfully", user: user });
    }
  } catch (error) {
    console.log("Failed to delete user", error);
  }
});
//connecting mongodb and starting the server
mongoose
  .connect("mongodb://localhost:27017/taste1")
  .then(() => {
    console.log("Mongodb connected!");
    app.listen(port, (req, res) => {
      console.log(`Server is listening on Port: ${port}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb Connection Failed.", error);
  });
