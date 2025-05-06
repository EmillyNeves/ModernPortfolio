import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = "/api";

  // User routes
  app.get(`${apiPrefix}/user`, async (req, res) => {
    try {
      const user = await storage.getUser(1); // In a real app, get user from session
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Tasks routes
  app.get(`${apiPrefix}/tasks`, async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      return res.json({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Courses routes
  app.get(`${apiPrefix}/courses`, async (req, res) => {
    try {
      const courses = await storage.getCourses();
      return res.json({ 
        courses,
        period: "4º PERÍODO FATORIAL"
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Schedule routes
  app.get(`${apiPrefix}/schedule`, async (req, res) => {
    try {
      const schedule = await storage.getSchedule();
      return res.json({ schedule });
    } catch (error) {
      console.error("Error fetching schedule:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Notifications routes
  app.get(`${apiPrefix}/notifications`, async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      return res.json({ notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Attendance routes
  app.get(`${apiPrefix}/attendance`, async (req, res) => {
    try {
      const courses = await storage.getCourses();
      const attendanceRecords = await storage.getAttendance();
      
      return res.json({ 
        courses,
        attendance: attendanceRecords
      });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Grades routes
  app.get(`${apiPrefix}/grades`, async (req, res) => {
    try {
      const courses = await storage.getCourses();
      const assessments = await storage.getAssessments();
      
      // Add assessments to each course
      const coursesWithAssessments = courses.map(course => {
        const courseAssessments = assessments.filter(a => a.courseId === course.id);
        return {
          ...course,
          assessments: courseAssessments
        };
      });
      
      return res.json({ courses: coursesWithAssessments });
    } catch (error) {
      console.error("Error fetching grades:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Progress routes
  app.get(`${apiPrefix}/progress`, async (req, res) => {
    try {
      const xpProgress = [
        { date: "Jan", xp: 150 },
        { date: "Feb", xp: 420 },
        { date: "Mar", xp: 890 },
        { date: "Apr", xp: 1230 },
        { date: "May", xp: 1670 },
        { date: "Jun", xp: 2570 }
      ];
      
      const taskCompletion = [
        { course: "CALC", completed: 14, pending: 2 },
        { course: "ALG", completed: 12, pending: 4 },
        { course: "ED", completed: 10, pending: 6 },
        { course: "ELD", completed: 8, pending: 8 }
      ];
      
      const overview = [
        { label: "COURSES", value: "4", description: "Active courses this semester" },
        { label: "TASKS", value: "44/60", description: "Tasks completed overall" },
        { label: "ATTENDANCE", value: "92%", description: "Average attendance rate" },
        { label: "GRADE", value: "8.7", description: "Current GPA (0-10)" }
      ];
      
      const achievements = await storage.getAchievements();
      
      return res.json({
        xpProgress,
        taskCompletion,
        overview,
        achievements
      });
    } catch (error) {
      console.error("Error fetching progress data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Developer tools routes
  app.get(`${apiPrefix}/developer`, async (req, res) => {
    try {
      const systemInfo = {
        semester: "2023.1",
        daysRemaining: 45,
        version: "1.5.2",
      };
      
      const apiEndpoints = [
        { method: "GET", url: "/api/user", description: "Get current user data" },
        { method: "GET", url: "/api/courses", description: "List all enrolled courses" },
        { method: "GET", url: "/api/tasks", description: "Get all tasks and assignments" },
        { method: "GET", url: "/api/schedule", description: "Get weekly class schedule" },
        { method: "GET", url: "/api/attendance", description: "Get attendance records" },
        { method: "POST", url: "/api/tasks/:id/complete", description: "Mark task as completed" },
      ];
      
      const studyTips = [
        { 
          title: "Spaced Repetition", 
          description: "Use the Pomodoro technique (25 min work, 5 min break) for Algebra Linear and Cálculo IV. These courses benefit from consistent daily practice rather than cramming.",
          relevance: 95
        },
        { 
          title: "Visual Learning for ELD", 
          description: "Create visual circuit diagrams and truth tables for Elementos da Lógica Digital. Associating visual patterns with logical concepts improves retention by 40%.",
          relevance: 88
        },
        { 
          title: "Practical Application for ED", 
          description: "Implement data structures learned in Estrutura de Dados in small coding projects. Practical application reinforces theoretical knowledge and prepares you for technical interviews.",
          relevance: 92
        },
        { 
          title: "Group Study Sessions", 
          description: "Form a study group for your most challenging subject. Teaching concepts to others solidifies your understanding and exposes knowledge gaps.",
          relevance: 75
        }
      ];
      
      return res.json({
        systemInfo,
        apiEndpoints,
        studyTips
      });
    } catch (error) {
      console.error("Error fetching developer tools data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
