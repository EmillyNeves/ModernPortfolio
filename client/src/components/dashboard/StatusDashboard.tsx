import React from "react";
import { formatAttendanceStatus } from "@/lib/utils";
import { Course, Schedule } from "@shared/schema";

interface StatusDashboardProps {
  courses: Course[];
  weeklySchedule: Schedule[];
  period: string;
}

const StatusDashboard: React.FC<StatusDashboardProps> = ({ courses, weeklySchedule, period }) => {
  const weekDays = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA"];
  
  // Group schedule by time slots
  const scheduleByTimeSlot: Record<string, (Schedule | null)[]> = {};
  
  // Initialize time slots
  const timeSlots = ["8:00", "10:00", "14:00"];
  timeSlots.forEach(timeSlot => {
    scheduleByTimeSlot[timeSlot] = Array(5).fill(null);
  });
  
  // Fill in schedule data
  weeklySchedule.forEach(item => {
    const dayIndex = weekDays.findIndex(day => day === item.day);
    const timeSlotIndex = timeSlots.findIndex(time => time === item.time);
    
    if (dayIndex !== -1 && timeSlotIndex !== -1) {
      scheduleByTimeSlot[timeSlots[timeSlotIndex]][dayIndex] = item;
    }
  });

  return (
    <div className="terminal-window p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-primary font-orbitron text-lg title-caps">CONTROLE DE FALTAS</h2>
        <span className="text-white/70 font-fira text-xs">{period}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* Attendance Table - Weekly view*/}
        <div className="lg:col-span-5 overflow-x-auto">
          <div className="terminal-window bg-card rounded-lg p-4 border border-accent/30 h-full">
            <div className="grid grid-cols-5 gap-2">
              {/* Days Header */}
              {weekDays.map((day) => (
                <div key={day} className="text-white/90 font-fira text-xs text-center">
                  {day}
                </div>
              ))}

              {/* Schedule Grid */}
              {Object.entries(scheduleByTimeSlot).map(([timeSlot, slots]) => 
                // Render each slot directly without React.Fragment
                slots.map((item, index) => (
                  <div
                    key={`${timeSlot}-${index}`}
                    className={`${
                      item?.courseCode
                        ? "bg-accent/20 border border-accent/50"
                        : "bg-white/5 border border-white/10"
                    } rounded text-center py-2 text-xs font-fira`}
                  >
                    {item?.courseCode || "--"}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="lg:col-span-2">
          <div className="terminal-window bg-card h-full rounded-lg p-4 border border-primary/30">
            <h3 className="text-primary font-orbitron text-md mb-4 title-caps">TOTAL</h3>
            <ul className="space-y-2 font-fira text-xs">
              {courses.map((course) => (
                <li key={course.id} className="flex justify-between">
                  <span className="text-white/80">{course.code}</span>
                  <span className="text-primary">
                    {course.attendance.current}/{course.attendance.max}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-primary font-orbitron text-xs mb-2">NOTA:</h4>
              <p className="text-white/70 font-fira text-xs leading-relaxed">
                Disciplina com &gt;25% de faltas (&gt;7 aulas) você pode reprovar automaticamente.
                <br />
                <br />
                Se tiver nota &gt;7 em 75% do semestre, você pode faltar até 14 aulas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDashboard;
