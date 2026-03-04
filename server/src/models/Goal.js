import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    progress: { type: Number, default: 0 },
    status: { type: String, default: "Off Track" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    deadline: { type: Date },
    subTask : [{
        text : String,
        completed: { type: Boolean, default: false }
      }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

  },
  { timestamps: true },
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
