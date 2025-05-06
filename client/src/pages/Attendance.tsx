import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";
import { Schedule } from "@shared/schema";

const Attendance: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch course attendance data
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["/api/attendance"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/attendance", undefined);
      return res.json();
    },
  });

  // Fetch schedule data
  const { data: scheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ["/api/schedule"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/schedule", undefined);
      return res.json();
    },
  });

  const isDataLoading = isLoading || scheduleLoading;

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-primary font-orbitron text-xl animate-pulse">LOADING_ATTENDANCE_DATA...</div>
      </div>
    );
  }

  // Helper function to get day name
  const getDayName = (day: number): string => {
    const days = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
    return days[day];
  };

  // Group attendance by date
  const attendanceByDate: { [key: string]: any[] } = {};
  
  if (attendanceData && attendanceData.attendance) {
    attendanceData.attendance.forEach((item: any) => {
      const date = new Date(item.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!attendanceByDate[dateKey]) {
        attendanceByDate[dateKey] = [];
      }
      
      attendanceByDate[dateKey].push({
        ...item,
        dayName: getDayName(date.getDay())
      });
    });
  }
  
  const attendanceDates = Object.keys(attendanceByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Helper function to get attendance percentage
  const getAttendancePercentage = (current: number, max: number): number => {
    return Math.round((current / max) * 100);
  };

  // Week days for schedule display
  const weekDays = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA"];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Calendar className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl font-orbitron font-bold text-white">CONTROLE_DE_FALTAS</h1>
      </div>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="terminal-window bg-card border-accent/30">
          <TabsTrigger value="overview" className="font-fira text-xs">OVERVIEW</TabsTrigger>
          <TabsTrigger value="schedule" className="font-fira text-xs">SCHEDULE</TabsTrigger>
          <TabsTrigger value="history" className="font-fira text-xs">HISTORY</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceData && attendanceData.courses && attendanceData.courses.map((course: any) => (
              <Card key={course.id} className="terminal-window bg-card/70">
                <CardHeader>
                  <CardTitle className="text-primary font-orbitron text-lg">
                    {course.code}
                  </CardTitle>
                  <CardDescription className="font-fira text-white/70 text-xs">
                    {course.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-fira text-xs text-white/80">Attendance</span>
                        <span className="font-fira text-xs text-accent">
                          {course.attendance.current}/{course.attendance.max}
                        </span>
                      </div>
                      <Progress 
                        value={getAttendancePercentage(course.attendance.current, course.attendance.max)} 
                        indicatorColor={
                          getAttendancePercentage(course.attendance.current, course.attendance.max) > 75 
                            ? "bg-primary" 
                            : getAttendancePercentage(course.attendance.current, course.attendance.max) > 50 
                              ? "bg-yellow-400"
                              : "bg-destructive"
                        }
                      />
                    </div>
                    
                    <div className="text-xs font-fira text-white/60 space-y-1">
                      <div className="flex justify-between">
                        <span>Maximum Absences:</span>
                        <span>{Math.floor(course.attendance.max * 0.25)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Absences:</span>
                        <span className={course.attendance.absences > Math.floor(course.attendance.max * 0.25) * 0.7 ? "text-destructive" : ""}>
                          {course.attendance.absences}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining Absences:</span>
                        <span>
                          {Math.max(0, Math.floor(course.attendance.max * 0.25) - course.attendance.absences)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card className="terminal-window bg-card/70">
            <CardHeader>
              <CardTitle className="text-primary font-orbitron text-lg">
                WEEKLY_SCHEDULE
              </CardTitle>
              <CardDescription className="font-fira text-white/70 text-xs">
                Class schedule for current semester
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="terminal-window bg-card rounded-lg p-4 border border-accent/30 min-w-full">
                  <div className="grid grid-cols-5 gap-2">
                    {/* Days Header */}
                    {weekDays.map((day) => (
                      <div key={day} className="text-white/90 font-fira text-xs text-center">
                        {day}
                      </div>
                    ))}
                    
                    {/* Time slots */}
                    {["8:00", "10:00", "14:00"].map((timeSlot) => {
                      // Filter schedule items for this time slot
                      const timeSlotClasses: (Schedule | null)[] = Array(5).fill(null);
                      
                      if (scheduleData && scheduleData.schedule) {
                        scheduleData.schedule.forEach((item: Schedule) => {
                          if (item.time === timeSlot) {
                            const dayIndex = weekDays.findIndex(day => day === item.day);
                            if (dayIndex !== -1) {
                              timeSlotClasses[dayIndex] = item;
                            }
                          }
                        });
                      }
                      
                      return timeSlotClasses.map((item, index) => (
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
                      ));
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="terminal-window bg-card/70">
            <CardHeader>
              <CardTitle className="text-primary font-orbitron text-lg">
                ATTENDANCE_HISTORY
              </CardTitle>
              <CardDescription className="font-fira text-white/70 text-xs">
                Recent attendance records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {attendanceDates.map((dateKey) => (
                <div key={dateKey} className="terminal-window bg-card p-3 border border-accent/20 rounded-lg">
                  <div className="text-white/90 font-orbitron text-sm mb-2">
                    {new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {attendanceByDate[dateKey].map((record, idx) => (
                      <div key={`${dateKey}-${idx}`} className="flex justify-between font-fira text-xs border-b border-white/10 py-1">
                        <span className="text-white/80">{record.courseCode} - {record.time}</span>
                        <span className={record.status === 'present' ? "text-primary" : "text-destructive"}>
                          {record.status === 'present' ? 'PRESENT' : 'ABSENT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
