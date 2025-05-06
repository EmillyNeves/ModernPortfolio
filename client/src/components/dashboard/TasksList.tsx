import React from "react";
import { Task } from "@shared/schema";

interface TasksListProps {
  tasks: Task[];
}

const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  return (
    <div className="terminal-window p-4">
      <h2 className="text-primary font-orbitron text-md mb-4 title-caps">TASKS</h2>
      <ul className="space-y-3 font-fira text-xs">
        {tasks.map((task) => (
          <li key={task.id} className="border-b border-white/10 pb-2">
            <div className="flex justify-between">
              <span className="text-white/80">
                {task.code ? `${task.code} - ` : ""}
                {task.name}
              </span>
              {task.dueDate ? (
                <span
                  className={
                    task.completed
                      ? "text-primary"
                      : task.status === "pending"
                      ? "text-yellow-400"
                      : task.status === "overdue"
                      ? "text-destructive"
                      : "text-white/60"
                  }
                >
                  {task.completed
                    ? `${task.completedCount}/${task.totalCount}`
                    : task.dueDate === "--"
                    ? "--/--"
                    : task.dueDate}
                </span>
              ) : (
                <span className="text-white/60">--/--</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
