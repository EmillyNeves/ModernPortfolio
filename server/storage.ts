import { db } from "@db";
import { eq, desc } from "drizzle-orm";
import * as schema from "@shared/schema";

class Storage {
  // User methods
  async getUser(id: number): Promise<schema.User | null> {
    const users = await db.query.users.findMany({
      where: eq(schema.users.id, id),
      limit: 1,
    });
    return users.length > 0 ? users[0] : null;
  }
  
  async updateUserAvatar(id: number, avatarConfig: string): Promise<schema.User | null> {
    const result = await db.update(schema.users)
      .set({ avatarConfig })
      .where(eq(schema.users.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }

  // Course methods
  async getCourses(): Promise<schema.Course[]> {
    return await db.query.courses.findMany();
  }

  async getCourse(id: number): Promise<schema.Course | null> {
    const courses = await db.query.courses.findMany({
      where: eq(schema.courses.id, id),
      limit: 1,
    });
    return courses.length > 0 ? courses[0] : null;
  }

  // Task methods
  async getTasks(): Promise<schema.Task[]> {
    return await db.query.tasks.findMany();
  }

  async getTask(id: number): Promise<schema.Task | null> {
    const tasks = await db.query.tasks.findMany({
      where: eq(schema.tasks.id, id),
      limit: 1,
    });
    return tasks.length > 0 ? tasks[0] : null;
  }

  // Schedule methods
  async getSchedule(): Promise<schema.Schedule[]> {
    return await db.query.schedule.findMany();
  }

  // Assessment methods
  async getAssessments(): Promise<schema.Assessment[]> {
    return await db.query.assessments.findMany();
  }

  async getAssessmentsByCourse(courseId: number): Promise<schema.Assessment[]> {
    return await db.query.assessments.findMany({
      where: eq(schema.assessments.courseId, courseId),
    });
  }

  // Attendance methods
  async getAttendance(): Promise<schema.Attendance[]> {
    return await db.query.attendance.findMany({
      orderBy: (attendance) => [desc(attendance.date)],
    });
  }

  async getAttendanceByCourse(courseId: number): Promise<schema.Attendance[]> {
    return await db.query.attendance.findMany({
      where: eq(schema.attendance.courseId, courseId),
      orderBy: (attendance) => [desc(attendance.date)],
    });
  }

  // Notification methods
  async getNotifications(): Promise<schema.Notification[]> {
    // Using direct SQL query as a workaround for relational query issues
    const result = await db.select().from(schema.notifications);
    return result;
  }

  // Achievement methods
  async getAchievements(): Promise<schema.Achievement[]> {
    return await db.query.achievements.findMany();
  }
}

// Export the storage instance
export const storage = new Storage();
