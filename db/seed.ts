import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Seeding database...");

    // Check if users exist
    const existingUsers = await db.query.users.findMany();
    if (existingUsers.length === 0) {
      // Seed User
      const [user] = await db
        .insert(schema.users)
        .values({
          username: "MERAKI",
          password: "hashed_password",
          title: "Veterano",
          level: 4,
          xp: { current: 2570, max: 4000 },
          stats: {
            intelligence: 87,
            logic: 92,
            memory: 76,
            energy: 54,
          },
        })
        .returning();

      console.log("Created user:", user.id);

      // Seed Courses
      const courses = await db
        .insert(schema.courses)
        .values([
          {
            code: "CALC",
            name: "Cálculo IV",
            description: "Advanced calculus including multivariable calculus and differential equations",
            semester: 4,
            credits: 4,
            attendance: { current: 1, max: 7, absences: 0 },
            stats: { performance: 0.85 },
            nextAssessment: "Jun 15",
          },
          {
            code: "ALG",
            name: "Algebra Linear",
            description: "Linear algebra including vector spaces, matrices, and linear transformations",
            semester: 4,
            credits: 4,
            attendance: { current: 1, max: 7, absences: 0 },
            stats: { performance: 0.92 },
            nextAssessment: "Jun 20",
          },
          {
            code: "ED",
            name: "Estrutura de Dados",
            description: "Data structures including lists, trees, graphs, and algorithm complexity",
            semester: 4,
            credits: 4,
            attendance: { current: 1, max: 7, absences: 0 },
            stats: { performance: 0.78 },
            nextAssessment: "Jun 12",
          },
          {
            code: "ELD",
            name: "Elemento da Lógica Digital",
            description: "Digital logic elements including boolean algebra, gates, and combinational circuits",
            semester: 4,
            credits: 4,
            attendance: { current: 1, max: 7, absences: 0 },
            stats: { performance: 0.65 },
            nextAssessment: "Jun 18",
          },
        ])
        .returning();

      console.log(`Created ${courses.length} courses`);

      // Get course IDs for relationships
      const calcCourse = courses.find((c) => c.code === "CALC");
      const algCourse = courses.find((c) => c.code === "ALG");
      const edCourse = courses.find((c) => c.code === "ED");
      const eldCourse = courses.find((c) => c.code === "ELD");

      // Seed Tasks
      await db.insert(schema.tasks).values([
        {
          name: "Cálculo IV",
          code: "CALC",
          courseId: calcCourse?.id,
          dueDate: "01/16",
          completed: true,
          completedCount: 1,
          totalCount: 16,
          status: "completed",
          xpReward: 100,
        },
        {
          name: "Algebra Linear",
          code: "ALG",
          courseId: algCourse?.id,
          dueDate: "01/16",
          completed: true,
          completedCount: 1,
          totalCount: 16,
          status: "completed",
          xpReward: 100,
        },
        {
          name: "Estrutura de Dados",
          code: "ED",
          courseId: edCourse?.id,
          dueDate: "01/16",
          completed: true,
          completedCount: 1,
          totalCount: 16,
          status: "completed",
          xpReward: 100,
        },
        {
          name: "Elemento da Lógica Digital",
          code: "ELD",
          courseId: eldCourse?.id,
          dueDate: "01/16",
          completed: true,
          completedCount: 1,
          totalCount: 16,
          status: "completed",
          xpReward: 100,
        },
        {
          name: "Iniciação Científica",
          dueDate: "--",
          completed: false,
          completedCount: 0,
          totalCount: 0,
          status: "pending",
          xpReward: 200,
        },
        {
          name: "Estágio",
          dueDate: "--",
          completed: false,
          completedCount: 0,
          totalCount: 0,
          status: "pending",
          xpReward: 300,
        },
      ]);

      // Seed Schedule
      await db.insert(schema.schedule).values([
        {
          day: "SEGUNDA",
          time: "8:00",
          courseId: calcCourse?.id,
          courseCode: "CALC",
          location: "Room 101",
        },
        {
          day: "SEGUNDA",
          time: "10:00",
          courseId: edCourse?.id,
          courseCode: "ED",
          location: "Room 203",
        },
        {
          day: "TERÇA",
          time: "10:00",
          courseId: calcCourse?.id,
          courseCode: "CALC",
          location: "Room 101",
        },
        {
          day: "TERÇA",
          time: "14:00",
          courseId: eldCourse?.id,
          courseCode: "ELD",
          location: "Lab 305",
        },
        {
          day: "QUARTA",
          time: "8:00",
          courseId: calcCourse?.id,
          courseCode: "CALC",
          location: "Room 101",
        },
        {
          day: "QUARTA",
          time: "10:00",
          courseId: edCourse?.id,
          courseCode: "ED",
          location: "Room 203",
        },
        {
          day: "QUINTA",
          time: "10:00",
          courseId: calcCourse?.id,
          courseCode: "CALC",
          location: "Room 101",
        },
        {
          day: "QUINTA",
          time: "14:00",
          courseId: eldCourse?.id,
          courseCode: "ELD",
          location: "Lab 305",
        },
        {
          day: "SEXTA",
          time: "8:00",
          courseId: algCourse?.id,
          courseCode: "ALG",
          location: "Room 102",
        },
        {
          day: "SEXTA",
          time: "10:00",
          courseId: algCourse?.id,
          courseCode: "ALG",
          location: "Room 102",
        },
      ]);

      // Seed Assessments
      await db.insert(schema.assessments).values([
        {
          name: "Midterm Exam",
          courseId: calcCourse?.id,
          date: "Apr 15",
          score: 8.5,
          weight: 30,
          feedback: "Good work on multivariable calculus section. Need improvement on differential equations.",
        },
        {
          name: "Problem Set 1",
          courseId: calcCourse?.id,
          date: "Mar 10",
          score: 9.2,
          weight: 10,
          feedback: "Excellent problem-solving approach.",
        },
        {
          name: "Matrix Theory Quiz",
          courseId: algCourse?.id,
          date: "Apr 5",
          score: 9.5,
          weight: 20,
          feedback: "Perfect understanding of matrix operations.",
        },
        {
          name: "Vector Spaces Assignment",
          courseId: algCourse?.id,
          date: "Mar 20",
          score: 8.7,
          weight: 15,
          feedback: "Good work but pay attention to proof techniques.",
        },
        {
          name: "Data Structures Implementation",
          courseId: edCourse?.id,
          date: "Apr 12",
          score: 7.8,
          weight: 25,
          feedback: "Binary tree implementation needs optimization.",
        },
        {
          name: "Algorithm Analysis Quiz",
          courseId: edCourse?.id,
          date: "Mar 25",
          score: 8.2,
          weight: 15,
          feedback: "Good understanding of Big O notation.",
        },
        {
          name: "Logic Gates Lab",
          courseId: eldCourse?.id,
          date: "Apr 8",
          score: 6.5,
          weight: 20,
          feedback: "Circuit design needed troubleshooting.",
        },
        {
          name: "Boolean Algebra Quiz",
          courseId: eldCourse?.id,
          date: "Mar 15",
          score: 7.0,
          weight: 15,
          feedback: "Review simplification techniques.",
        },
      ]);

      // Seed Attendance records
      const today = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      
      // Generate attendance for the past 14 days
      for (let i = 0; i < 14; i++) {
        const date = new Date(today.getTime() - (i * oneDay));
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        
        // Map day of week to schedule day
        const scheduleDays = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
        const scheduleDay = scheduleDays[dayOfWeek];
        
        // Get scheduled classes for this day
        const scheduledClasses = await db.query.schedule.findMany({
          where: eq(schema.schedule.day, scheduleDay),
        });
        
        // Create attendance records for each scheduled class
        for (const scheduledClass of scheduledClasses) {
          await db.insert(schema.attendance).values({
            courseId: scheduledClass.courseId,
            courseCode: scheduledClass.courseCode,
            date: date,
            time: scheduledClass.time,
            status: Math.random() > 0.1 ? "present" : "absent", // 90% chance of being present
          });
        }
      }

      // Seed Notifications
      await db.insert(schema.notifications).values([
        {
          userId: user.id,
          title: "SYSTEM_ASSISTANT",
          message: "Detectei que você possui 3 entregas esta semana. Organize seu tempo para completar as tarefas de CALC e ALG. Você ganhará +150 XP ao completar todas!",
          read: false,
        },
      ]);

      // Seed Achievements
      await db.insert(schema.achievements).values([
        {
          userId: user.id,
          name: "Perfect Attendance",
          description: "Attend all classes for 2 consecutive weeks",
          icon: "star",
          progress: 90,
          completed: false,
        },
        {
          userId: user.id,
          name: "Math Wizard",
          description: "Achieve 90%+ in all math-related courses",
          icon: "medal",
          progress: 85,
          completed: false,
        },
        {
          userId: user.id,
          name: "Coding Guru",
          description: "Complete all programming assignments with 85%+ score",
          icon: "trophy",
          progress: 75,
          completed: false,
        },
        {
          userId: user.id,
          name: "Early Bird",
          description: "Submit 5 assignments at least 2 days before deadline",
          icon: "rocket",
          progress: 100,
          completed: true,
        },
      ]);

      console.log("Database seeded successfully!");
    } else {
      console.log("Database already has data, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
