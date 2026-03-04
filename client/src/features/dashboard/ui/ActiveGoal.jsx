import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import { CheckCircle2, Circle, Trash2, Calendar, AlertCircle, Plus } from "lucide-react";

const ActiveGoal = ({ id, title, progress: serverProgress, status, deadline, subTask = [], onDelete, setGoals, priority }) => {
  // We keep local state for subtasks to ensure the UI is snappy
  const [localSubTasks, setLocalSubTasks] = useState(subTask);
  const [newSubTaskText, setNewSubTaskText] = useState("");

  // Sync with server if goals refresh
  useEffect(() => {
    setLocalSubTasks(subTask);
  }, [subTask]);

  // --- LOGIC: AUTOMATED PROGRESS ---
  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleToggleSubTask = async (index) => {
    // 1. Update local array by index
    const updatedTasks = localSubTasks.map((st, i) => 
      i === index ? { ...st, completed: !st.completed } : st
    );
    
    // 2. Calculate new progress based on subtasks
    const newProgress = calculateProgress(updatedTasks);

    // 3. Update UI state immediately
    setLocalSubTasks(updatedTasks);
    setGoals(prev => prev.map(g => 
      g._id === id ? { ...g, subTask: updatedTasks, progress: newProgress } : g
    ));

    // 4. SYNC TO DATABASE
    try {
      await API.patch(`/goals/update/${id}`, { 
        subTask: updatedTasks,
        progress: newProgress 
      });
    } catch (err) {
      console.error("Failed to sync subtask", err);
    }
  };

  const handleAddSubTask = async () => {
    if (!newSubTaskText.trim()) return;
    
    const newTask = { text: newSubTaskText.trim(), completed: false };
    const updatedTasks = [...localSubTasks, newTask];
    const newProgress = calculateProgress(updatedTasks);
    
    setLocalSubTasks(updatedTasks);
    setNewSubTaskText("");
    setGoals(prev => prev.map(g => 
      g._id === id ? { ...g, subTask: updatedTasks, progress: newProgress } : g
    ));

    try {
      await API.patch(`/goals/update/${id}`, { 
        subTask: updatedTasks,
        progress: newProgress 
      });
    } catch (err) {
      console.error("Failed to add subtask", err);
    }
  };

  // --- HELPERS (Styles & Dates) ---
  const getDynamicStatus = (val) => {
    if (val === 100) return "Completed";
    if (val >= 60) return "On Track";
    return val >= 30 ? "At Risk" : "Off Track";
  };

  const currentStatus = getDynamicStatus(calculateProgress(localSubTasks));

  const STATUS_STYLES = {
    "Completed": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "On Track": "bg-green-500/10 text-green-400 border-green-500/20",
    "At Risk": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "Off Track": "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const getPriorityStyles = (p) => {
    switch (p) {
      case "High": return "text-red-500 border-red-500/20 bg-red-500/5";
      case "Medium": return "text-amber-500 border-amber-500/20 bg-amber-500/5";
      default: return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    }
  };

  const remainingDays = () => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = remainingDays();
  const progressPercent = calculateProgress(localSubTasks);

  return (
    <div className="group relative rounded-2xl bg-[#141414] border border-white/5 mb-6 p-5 transition-all hover:border-white/10 shadow-2xl">
      
      {/* Delete Button */}
      <button onClick={() => onDelete(id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors">
        <Trash2 size={18} />
      </button>

      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-100 tracking-tight">{title}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-black uppercase ${getPriorityStyles(priority)}`}>
              {priority}
            </span>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full border font-bold uppercase ${STATUS_STYLES[currentStatus]}`}>
            {currentStatus}
          </span>
        </div>
      </div>

      {/* Subtasks Section - This is where the work happens */}
      <div className="space-y-2 mb-6">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Checklist</p>
        
        {/* Add new subtask input */}
        <div className="flex gap-2 mb-3">
          <input
            placeholder="Add a step..."
            value={newSubTaskText}
            onChange={(e) => setNewSubTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
            className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-sm focus:border-blue-500 outline-none transition-all text-zinc-300 placeholder:text-zinc-600"
          />
          <button
            onClick={handleAddSubTask}
            disabled={!newSubTaskText.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-lg transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        {localSubTasks.map((st, index) => (
          <div 
            key={st._id || index} 
            onClick={() => handleToggleSubTask(index)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
              st.completed ? "bg-white/[0.02] border-white/5" : "bg-white/[0.04] border-white/10 hover:border-blue-500/30"
            }`}
          >
            {st.completed ? (
              <CheckCircle2 size={18} className="text-blue-500" />
            ) : (
              <Circle size={18} className="text-zinc-600" />
            )}
            <span className={`text-sm font-medium ${st.completed ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
              {st.text}
            </span>
          </div>
        ))}
      </div>

      {/* Automated Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
          <span className="text-zinc-500">Auto-Progress</span>
          <span className="text-blue-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Calendar size={12} />
          <span>{deadline ? new Date(deadline).toLocaleDateString() : 'Ongoing'}</span>
        </div>
        {daysLeft !== null && (
          <div className={`flex items-center gap-1 ${daysLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>
            <AlertCircle size={12} />
            <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Due Today'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveGoal;