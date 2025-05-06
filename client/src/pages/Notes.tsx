import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, BookOpen, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpeechBubble from "@/components/dashboard/SpeechBubble";

const Notes: React.FC = () => {
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  // Fetch grade data
  const { data: gradesData, isLoading } = useQuery({
    queryKey: ["/api/grades"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/grades", undefined);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-primary font-orbitron text-xl animate-pulse">LOADING_GRADES_DATA...</div>
      </div>
    );
  }

  // Helper function to get the grade style based on value
  const getGradeStyle = (grade: number) => {
    if (grade >= 9) return "text-primary font-bold";
    if (grade >= 7) return "text-accent";
    if (grade >= 5) return "text-yellow-400";
    return "text-destructive";
  };

  // Calculate average grade
  const calculateAverage = (grades: number[]): number => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return parseFloat((sum / grades.length).toFixed(1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Edit3 className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl font-orbitron font-bold text-white">NOTAS_ACADEMICAS</h1>
      </div>

      {gradesData && gradesData.courses && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradesData.courses.map((course: any) => {
              const average = calculateAverage(course.assessments.map((a: any) => a.score));
              
              return (
                <Card 
                  key={course.id} 
                  className={`terminal-window bg-card/70 cursor-pointer hover:border-primary transition-colors ${
                    activeCourse === course.id ? "border border-primary" : ""
                  }`}
                  onClick={() => setActiveCourse(course.id)}
                >
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
                          <span className="font-fira text-xs text-white/80">Average Grade</span>
                          <span className={`font-fira text-xs ${getGradeStyle(average)}`}>
                            {average.toFixed(1)}/10
                          </span>
                        </div>
                        <Progress 
                          value={average * 10} 
                          indicatorColor={
                            average >= 7 
                              ? "bg-primary" 
                              : average >= 5 
                                ? "bg-yellow-400"
                                : "bg-destructive"
                          }
                        />
                      </div>
                      
                      <div className="text-xs font-fira text-white/60 space-y-1">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={average >= 7 ? "text-primary" : average >= 5 ? "text-yellow-400" : "text-destructive"}>
                            {average >= 7 ? "APPROVED" : average >= 5 ? "FINAL EXAM" : "AT RISK"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Assessments:</span>
                          <span>{course.assessments.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Assessment:</span>
                          <span>
                            {course.nextAssessment ? course.nextAssessment : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {activeCourse && (
            <Card className="terminal-window bg-card/70 mt-6">
              <CardHeader>
                <CardTitle className="text-primary font-orbitron text-lg">
                  {gradesData.courses.find((c: any) => c.id === activeCourse)?.code} - DETAILED_GRADES
                </CardTitle>
                <CardDescription className="font-fira text-white/70 text-xs">
                  Assessment details for {gradesData.courses.find((c: any) => c.id === activeCourse)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="assessments">
                  <TabsList className="terminal-window bg-card border-accent/30">
                    <TabsTrigger value="assessments" className="font-fira text-xs">ASSESSMENTS</TabsTrigger>
                    <TabsTrigger value="requirements" className="font-fira text-xs">REQUIREMENTS</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="assessments">
                    <div className="space-y-4 mt-4">
                      {gradesData.courses.find((c: any) => c.id === activeCourse)?.assessments.map((assessment: any, index: number) => (
                        <div key={index} className="terminal-window bg-card p-3 border border-accent/20 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-white/90 font-orbitron text-sm">{assessment.name}</span>
                            <span className={`font-fira text-xs ${getGradeStyle(assessment.score)}`}>
                              {assessment.score.toFixed(1)}/10
                            </span>
                          </div>
                          <div className="flex justify-between text-xs font-fira text-white/60">
                            <span>Date: {assessment.date}</span>
                            <span>Weight: {assessment.weight}%</span>
                          </div>
                          {assessment.feedback && (
                            <div className="mt-2 text-xs font-fira text-white/80 border-t border-white/10 pt-2">
                              <span className="text-accent">Feedback: </span>
                              {assessment.feedback}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {gradesData.courses.find((c: any) => c.id === activeCourse)?.assessments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-white/50">
                          <BookOpen className="h-10 w-10 mb-2" />
                          <p className="font-fira text-sm">No assessments recorded yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="requirements">
                    <div className="space-y-4 mt-4">
                      <div className="terminal-window bg-card p-4 border border-primary/20 rounded-lg">
                        <h3 className="text-primary font-orbitron text-sm mb-3">COURSE_REQUIREMENTS</h3>
                        
                        <ul className="space-y-2 font-fira text-xs text-white/80 list-disc pl-5">
                          <li>Minimum average of 7.0 to pass directly</li>
                          <li>Average between 5.0 and 6.9 requires final exam</li>
                          <li>Average below 5.0 fails the course</li>
                          <li>Maximum of 25% absences allowed (see Attendance)</li>
                          <li>All assignments must be submitted</li>
                        </ul>
                        
                        <div className="mt-4 p-3 border border-yellow-400/30 bg-yellow-400/10 rounded-md">
                          <div className="flex items-start">
                            <AlertTriangle className="text-yellow-400 h-4 w-4 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-fira text-xs text-yellow-400 font-bold">IMPORTANT</h4>
                              <p className="font-fira text-xs text-white/80 mt-1">
                                To calculate your required grade on remaining assessments, use the Grade Calculator in the Developer tab.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Advice Bubble */}
          {activeCourse && (
            <SpeechBubble
              title="GRADE_ASSISTANT"
              message={`Based on your current performance in ${gradesData.courses.find((c: any) => c.id === activeCourse)?.code}, you need to maintain an average of ${calculateAverage(gradesData.courses.find((c: any) => c.id === activeCourse)?.assessments.map((a: any) => a.score)) >= 7 ? "7.0+" : "8.0+"} in your remaining assessments to secure approval without a final exam.`}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Notes;
