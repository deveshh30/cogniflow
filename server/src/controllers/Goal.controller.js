import Goal from "../models/Goal.js";


export const addGoal = async (req, res) => {
  try {
    const { title, deadline, priority, subTask } = req.body;
    const userId = req.userId;
    
    const newGoal = await Goal.create({
      title,
      priority: priority || "Medium",
      subTask: subTask || [],
      user: userId,
      ...(deadline && { deadline: new Date(deadline) })
    });

    req.io.to(userId).emit("goal-added", newGoal);
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const deletedGoal = await Goal.findOneAndDelete({ _id: id, user: userId });

    if (!deletedGoal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    req.io.to(userId).emit("goal-deleted", id);
    res.status(200).json({ success: true, message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateGoalProgress = async (req, res) => {
  const { id } = req.params;
  const { subTask, progress } = req.body;
  const userId = req.userId;

  let status = "At Risk";
  if (progress >= 60) status = "On Track";
  if (progress === 100) status = "Completed"; 

  try {
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: id, user: userId }, 
      { subTask, progress, status }, 
      { new: true }
    );
    
    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    req.io.to(userId).emit("goal-progress-updated", { id, progress, status });
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};