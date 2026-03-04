import Goal from "../models/Goal.js";


export const addGoal = async (req, res) => {
  try {
    const { title, deadline, priority, subTask } = req.body;
    
    const newGoal = await Goal.create({
      title,
      priority: priority || "Medium",
      subTask: subTask || [],
      ...(deadline && { deadline: new Date(deadline) })
    });

    req.io.emit("goal-added", newGoal);
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateGoalProgress = async (req, res) => {
  const { id } = req.params;
  const {subTask , progress } = req.body;

  let status = "At Risk";
  if (progress >= 60) status = "On Track";
  if (progress === 100) status = "Completed"; 

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      id, 
      {subTask,  progress, status }, 
      { new: true }
    );
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};