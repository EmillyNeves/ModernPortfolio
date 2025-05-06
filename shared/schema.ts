import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  title: text("title").notNull().default("Rookie"),
  level: integer("level").notNull().default(1),
  xp: json("xp")
    .$type<{ current: number; max: number }>()
    .notNull()
    .default({ current: 0, max: 1000 }),
  stats: json("stats")
    .$type<{
      intelligence: number;
      logic: number;
      memory: number;
      energy: number;
    }>()
    .notNull()
    .default({
      intelligence: 50,
      logic: 50,
      memory: 50,
      energy: 50,
    }),
  avatar: json("avatar")
    .$type<{
      skinColor: string;
      eyesStyle: number;
      mouthStyle: number;
      accessory: string;
      hairStyle: string;
      hairColor: string;
    }>()
    .default({
      skinColor: "#00D9FF",
      eyesStyle: 1,
      mouthStyle: 1,
      accessory: "none",
      hairStyle: "short",
      hairColor: "#000000",
    }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  semester: integer("semester").notNull(),
  credits: integer("credits").notNull(),
  attendance: json("attendance")
    .$type<{ current: number; max: number; absences: number }>()
    .notNull()
    .default({ current: 0, max: 30, absences: 0 }),
  stats: json("stats")
    .$type<{ performance: number }>()
    .notNull()
    .default({ performance: 0 }),
  nextAssessment: text("next_assessment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code"),
  courseId: integer("course_id").references(() => courses.id),
  dueDate: text("due_date"),
  completed: boolean("completed").notNull().default(false),
  completedCount: integer("completed_count").notNull().default(0),
  totalCount: integer("total_count").notNull().default(0),
  status: text("status").notNull().default("pending"),
  xpReward: integer("xp_reward").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schedule
export const schedule = pgTable("schedule", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(),
  time: text("time").notNull(),
  courseId: integer("course_id").references(() => courses.id),
  courseCode: text("course_code").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assessments
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  courseId: integer("course_id").references(() => courses.id),
  date: text("date").notNull(),
  score: integer("score").notNull().default(0),
  weight: integer("weight").notNull().default(0),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Attendance
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  courseCode: text("course_code").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  progress: integer("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  notifications: many(notifications),
  achievements: many(achievements),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  tasks: many(tasks),
  schedule: many(schedule),
  assessments: many(assessments),
  attendance: many(attendance),
}));

// We'll add more detailed relations when we fix the database schema

// Validation schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCourseSchema = createInsertSchema(courses);
export const insertTaskSchema = createInsertSchema(tasks);
export const insertScheduleSchema = createInsertSchema(schedule);
export const insertAssessmentSchema = createInsertSchema(assessments);
export const insertAttendanceSchema = createInsertSchema(attendance);
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertAchievementSchema = createInsertSchema(achievements);

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Schedule = typeof schedule.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
