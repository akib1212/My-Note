const router = require("express").Router();
const authenticateToken = require("../models/auth.js");
const Task = require("../models/task.js");
const User = require("../models/user.js");

// create task route
router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const { id } = req.headers;
    const newTask = new Task({ title, desc });
    const saveTask = await newTask.save();
    const taskId = saveTask._id;
    await User.findByIdAndUpdate(id, { $push: { tasks: taskId._id } });
    res.status(201).json({ message: "Task Created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get all tasks route
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// delete tasks
router.delete("/delete-tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.id;
    await Task.findByIdAndDelete(id);
    const userData = await User.findByIdAndUpdate(userId, {
      $pull: { tasks: id },
    });

    return res.status(200).json({ message: "Task deleted sucessfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update tasks
router.put("/update-tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;
    await Task.findByIdAndUpdate(id, {
      title: title,
      desc: desc,
    });
    return res.status(200).json({ message: "Task updated sucessfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update importent tasks
router.put("/update-imp-tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const TaskData = await Task.findById(id);
    const ImpTask = TaskData.important;

    await Task.findByIdAndUpdate(id, {
      important: !ImpTask,
    });
    return res
      .status(200)
      .json({ message: "Task prioraty is changed sucessfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update complete tasks
router.put(
  "/update-complete-tasks/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const TaskData = await Task.findById(id);
      const completeTask = TaskData.complete;

      await Task.findByIdAndUpdate(id, {
        complete: !completeTask,
      });
      return res.status(200).json({ message: "Task completed sucessfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Get importent tasks route
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { important: true },
      options: { sort: { createdAt: -1 } },
    });

    if (!Data) {
      return res.status(404).json({ message: "Importent task not found" });
    }
    const ImpTaskData = Data.tasks;
    res.status(200).json({ data: ImpTaskData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get completed tasks route
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { complete: true },
      options: { sort: { createdAt: -1 } },
    });

    if (!Data) {
      return res.status(404).json({ message: "Importent task not found" });
    }
    const CompleteImpTaskData = Data.tasks;
    res.status(200).json({ data: CompleteImpTaskData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Get incompleted tasks route
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { complete: false },
      options: { sort: { createdAt: -1 } },
    });

    if (!Data) {
      return res.status(404).json({ message: "Importent task not found" });
    }
    const CompleteImpTaskData = Data.tasks;
    res.status(200).json({ data: CompleteImpTaskData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
