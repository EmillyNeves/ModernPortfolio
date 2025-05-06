import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Course, Assessment } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { calculateXpPercentage } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import LoadingBalloon from "@/components/animations/LoadingBalloon";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart, 
  Bar,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

type TimeRange = "semester" | "month" | "week";

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("semester");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch courses data
  const { data: coursesData } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch assessments data
  const { data: assessmentsData } = useQuery({
    queryKey: ['/api/assessments'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch attendance data
  const { data: attendanceData } = useQuery({
    queryKey: ['/api/attendance'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Check if data is loading
  const isLoading = !userData || !coursesData || !assessmentsData || !attendanceData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <LoadingBalloon message="CARREGANDO ANALYTICS" />
      </div>
    );
  }

  // Assert types - TypeScript doesn't know the structure of these objects
  // But we know they have this structure based on our API
  const user = (userData as any).user as User;
  const courses = (coursesData as any).courses as Course[];
  
  // Filter assessments based on selected course
  const assessmentsByCoursesData = (assessmentsData as any)?.courses || [];
  const filteredAssessments = selectedCourse === "all" 
    ? assessmentsByCoursesData
    : assessmentsByCoursesData.filter((course: any) => 
        course.courseCode === selectedCourse
      );

  // Prepare data for performance chart
  const performanceData = courses.map((course) => ({
    name: course.code,
    performance: course.stats.performance * 100,
    attendance: (course.attendance.current / course.attendance.max) * 100,
  }));

  // Prepare data for skills radar chart
  const skillsData = [
    { subject: 'Intelligence', A: user.stats.intelligence, fullMark: 100 },
    { subject: 'Logic', A: user.stats.logic, fullMark: 100 },
    { subject: 'Memory', A: user.stats.memory, fullMark: 100 },
    { subject: 'Energy', A: user.stats.energy, fullMark: 100 },
  ];

  // Prepare assessment scores over time
  const assessmentScores = filteredAssessments?.flatMap((course: any) => 
    course.assessments.map((assessment: Assessment) => ({
      name: assessment.name,
      course: course.courseCode,
      date: assessment.date,
      score: assessment.score * 10, // Convert to 100-point scale
    }))
  );

  // Sort assessment scores by date (assuming date format can be parsed chronologically)
  assessmentScores?.sort((a: any, b: any) => {
    // Handle dates in various formats (assuming MM/DD or Mon DD format)
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Calculate GPA based on assessment scores
  const calculateGPA = () => {
    const assessmentCoursesData = (assessmentsData as any)?.courses || [];
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    assessmentCoursesData.forEach((course: any) => {
      (course.assessments || []).forEach((assessment: Assessment) => {
        totalWeightedScore += assessment.score * assessment.weight;
        totalWeight += assessment.weight;
      });
    });
    
    return totalWeight ? (totalWeightedScore / totalWeight).toFixed(2) : 0;
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = () => {
    const attendanceCoursesData = (attendanceData as any)?.courses || [];
    
    let totalClasses = 0;
    let attendedClasses = 0;
    
    attendanceCoursesData.forEach((course: any) => {
      (course.attendance || []).forEach((record: any) => {
        totalClasses++;
        if (record.status === 'present') {
          attendedClasses++;
        }
      });
    });
    
    return totalClasses ? Math.round((attendedClasses / totalClasses) * 100) : 0;
  };

  // Prepare course distribution data
  const courseDistribution = courses.map(course => ({
    name: course.code,
    value: course.credits,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff6666'];

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-orbitron title-caps text-primary">PERFORMANCE ANALYTICS</h1>
        
        <div className="flex items-center gap-4">
          <Select 
            value={selectedCourse} 
            onValueChange={(value) => setSelectedCourse(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Cursos</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.code}>{course.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={timeRange} 
            onValueChange={(value) => setTimeRange(value as TimeRange)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semester">Semestre</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-background/80 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-orbitron title-caps text-secondary">GPA</CardTitle>
            <CardDescription>Rendimento Acadêmico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-orbitron text-primary">{calculateGPA()}</div>
            <p className="text-muted-foreground text-sm">De 10.0 máximo</p>
          </CardContent>
        </Card>

        <Card className="bg-background/80 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-orbitron title-caps text-secondary">XP LEVEL</CardTitle>
            <CardDescription>Progresso do Nível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-orbitron text-primary">{user.level}</div>
            <div className="mt-2">
              <Progress value={calculateXpPercentage(user.xp.current, user.xp.max)} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{user.xp.current} XP</span>
                <span>{user.xp.max} XP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-orbitron title-caps text-secondary">ATTENDANCE</CardTitle>
            <CardDescription>Taxa de Presença</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-orbitron text-primary">{calculateAttendancePercentage()}%</div>
            <p className="text-muted-foreground text-sm">Este semestre</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
          <TabsTrigger value="performance" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Tendências
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Habilidades
          </TabsTrigger>
          <TabsTrigger value="distribution" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Distribuição
          </TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-background/80 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg title-caps text-secondary">DESEMPENHO POR CURSO</CardTitle>
              <CardDescription>Comparativo de performance e presença em cada disciplina</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="performance" name="Performance" fill="#00ff8c" />
                    <Bar dataKey="attendance" name="Presença" fill="#9d00ff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-background/80 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg title-caps text-secondary">EVOLUÇÃO DE NOTAS</CardTitle>
              <CardDescription>Acompanhamento cronológico de avaliações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={assessmentScores}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" name="Nota" stroke="#00c8ff" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card className="bg-background/80 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg title-caps text-secondary">PERFIL DE HABILIDADES</CardTitle>
              <CardDescription>Análise das competências acadêmicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Suas Habilidades" dataKey="A" stroke="#ff00a0" fill="#ff00a0" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-6">
          <Card className="bg-background/80 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg title-caps text-secondary">DISTRIBUIÇÃO DE CRÉDITOS</CardTitle>
              <CardDescription>Proporção de créditos por disciplina</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {courseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights Section */}
      <div className="mt-12">
        <h2 className="text-xl font-orbitron title-caps text-secondary mb-4">INSIGHTS & RECOMENDAÇÕES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-background/80 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Pontos Fortes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Excelente desempenho em Álgebra Linear com 92% de aproveitamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Alta pontuação em habilidades de lógica (92/100)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Consistência em presença nas aulas (acima de 90%)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-background/80 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Áreas para Melhorar</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Elemento da Lógica Digital requer mais atenção (65% de aproveitamento)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Nível de energia abaixo da média (54/100) pode impactar o desempenho</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Considere aumentar participação em atividades para ganhar mais XP</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;