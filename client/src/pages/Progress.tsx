import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, TrendingUp, Award, Target, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import LoadingBalloon from "@/components/animations/LoadingBalloon";

// Minimal version of recharts for the status dashboard
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const ProgressPage: React.FC = () => {
  // Fetch progress data
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/progress", undefined);
      return res.json();
    },
  });

  // Fetch courses data for radar chart
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/courses", undefined);
      return res.json();
    },
  });

  const isLoading = progressLoading || coursesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingBalloon message="CARREGANDO PROGRESSO" />
      </div>
    );
  }

  // Transform course data for radar chart
  const radarData = coursesData?.courses.map((course: any) => ({
    subject: course.code,
    A: Math.min(100, (course.stats.performance || 0) * 100),
    fullMark: 100,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BarChart2 className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl font-orbitron font-bold text-white">PROGRESS_TRACKER</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {progressData?.overview.map((stat: any) => (
          <Card key={stat.label} className="terminal-window bg-card/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-primary font-orbitron text-md">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-orbitron font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-white/60 font-fira">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Progress Chart */}
        <Card className="terminal-window bg-card/70">
          <CardHeader>
            <CardTitle className="text-primary font-orbitron text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              XP_PROGRESSION
            </CardTitle>
            <CardDescription className="font-fira text-white/70 text-xs">
              Experience points gained over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData?.xpProgress}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff60"
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#ffffff60"
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#121212', 
                      border: '1px solid #00FF8C',
                      borderRadius: '4px',
                      color: '#ffffff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#00FF8C" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#00FF8C' }}
                    activeDot={{ r: 6, fill: '#00D9FF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Performance Radar */}
        <Card className="terminal-window bg-card/70">
          <CardHeader>
            <CardTitle className="text-primary font-orbitron text-lg flex items-center">
              <Target className="mr-2 h-5 w-5" />
              COURSE_PERFORMANCE
            </CardTitle>
            <CardDescription className="font-fira text-white/70 text-xs">
              Overall performance across courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                  />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#00D9FF"
                    fill="#00D9FF"
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#121212', 
                      border: '1px solid #00FF8C',
                      borderRadius: '4px',
                      color: '#ffffff'
                    }}
                    formatter={(value) => [`${value}%`, 'Performance']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Completion Chart */}
        <Card className="terminal-window bg-card/70">
          <CardHeader>
            <CardTitle className="text-primary font-orbitron text-lg flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              TASK_COMPLETION
            </CardTitle>
            <CardDescription className="font-fira text-white/70 text-xs">
              Assignments completed by course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={progressData?.taskCompletion}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="course" 
                    stroke="#ffffff60" 
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#ffffff60"
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#121212', 
                      border: '1px solid #00FF8C',
                      borderRadius: '4px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar 
                    dataKey="completed" 
                    name="Completed"
                    fill="#00FF8C" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="pending" 
                    name="Pending"
                    fill="#9D00FF" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="terminal-window bg-card/70">
          <CardHeader>
            <CardTitle className="text-primary font-orbitron text-lg flex items-center">
              <Award className="mr-2 h-5 w-5" />
              ACHIEVEMENTS
            </CardTitle>
            <CardDescription className="font-fira text-white/70 text-xs">
              Earned badges and accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData?.achievements.map((achievement: any) => (
                <div key={achievement.id} className="terminal-window bg-card p-3 border border-accent/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-3 text-lg">
                      {achievement.icon === "star" ? "⭐" : 
                       achievement.icon === "trophy" ? "🏆" : 
                       achievement.icon === "medal" ? "🥇" : 
                       achievement.icon === "rocket" ? "🚀" : "🎯"}
                    </div>
                    <div>
                      <div className="text-white/90 font-orbitron text-sm">{achievement.name}</div>
                      <div className="text-xs font-fira text-white/60 mt-1">{achievement.description}</div>
                    </div>
                  </div>
                  {achievement.progress < 100 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60 font-fira">Progress</span>
                        <span className="text-accent font-fira">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} indicatorColor="bg-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
