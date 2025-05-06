import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Calculator, Terminal, Lock, Lightbulb, CloudRainWind } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SpeechBubble from "@/components/dashboard/SpeechBubble";
import BalloonGallery from "@/components/avatar/BalloonGallery";

const Developer: React.FC = () => {
  // State for the grade calculator
  const [courseForCalculation, setCourseForCalculation] = useState<string>("");
  const [targetGrade, setTargetGrade] = useState<string>("7");
  const [calculateResult, setCalculateResult] = useState<string | null>(null);

  // Fetch developer tools data
  const { data: devToolsData, isLoading } = useQuery({
    queryKey: ["/api/developer"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/developer", undefined);
      return res.json();
    },
  });

  // Fetch courses for grade calculator
  const { data: coursesData } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/courses", undefined);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-primary font-orbitron text-xl animate-pulse">LOADING_DEVELOPER_TOOLS...</div>
      </div>
    );
  }

  const handleCalculate = () => {
    if (!courseForCalculation) {
      setCalculateResult("Error: Please select a course first");
      return;
    }

    const targetGradeNum = parseFloat(targetGrade);
    if (isNaN(targetGradeNum) || targetGradeNum < 0 || targetGradeNum > 10) {
      setCalculateResult("Error: Target grade must be between 0 and 10");
      return;
    }

    const course = coursesData?.courses.find((c: any) => c.id === courseForCalculation);
    if (!course) {
      setCalculateResult("Error: Course not found");
      return;
    }

    // Simple calculation based on current average and remaining assessments
    const currentAssessments = course.assessments || [];
    const completedWeight = currentAssessments.reduce((acc: number, a: any) => acc + a.weight, 0);
    const completedWeightedScore = currentAssessments.reduce(
      (acc: number, a: any) => acc + a.score * (a.weight / 100),
      0
    );
    
    const remainingWeight = 100 - completedWeight;
    
    if (remainingWeight <= 0) {
      setCalculateResult(`All assessments completed. Final grade: ${(completedWeightedScore).toFixed(1)}`);
      return;
    }
    
    // Calculate required score on remaining assessments
    const requiredScore = ((targetGradeNum - completedWeightedScore) / remainingWeight) * 100;
    
    if (requiredScore > 10) {
      setCalculateResult(`Target grade is not possible. You would need ${requiredScore.toFixed(1)}/10 on remaining assessments.`);
    } else if (requiredScore < 0) {
      setCalculateResult(`Target already achieved! Current weighted average: ${completedWeightedScore.toFixed(1)}`);
    } else {
      setCalculateResult(`You need to score at least ${requiredScore.toFixed(1)}/10 on remaining assessments (${remainingWeight}% of grade).`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Code className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl font-orbitron font-bold text-white">DEVELOPER_TOOLS</h1>
      </div>
      
      <Tabs defaultValue="calculator">
        <TabsList className="terminal-window bg-card border-accent/30">
          <TabsTrigger value="calculator" className="font-fira text-xs">
            <Calculator className="h-4 w-4 mr-1" />
            CALCULATOR
          </TabsTrigger>
          <TabsTrigger value="terminal" className="font-fira text-xs">
            <Terminal className="h-4 w-4 mr-1" />
            TERMINAL
          </TabsTrigger>
          <TabsTrigger value="api" className="font-fira text-xs">
            <Lock className="h-4 w-4 mr-1" />
            API ACCESS
          </TabsTrigger>
          <TabsTrigger value="tips" className="font-fira text-xs">
            <Lightbulb className="h-4 w-4 mr-1" />
            STUDY TIPS
          </TabsTrigger>
          <TabsTrigger value="balloons" className="font-fira text-xs">
            <CloudRainWind className="h-4 w-4 mr-1" />
            AVATARS
          </TabsTrigger>
        </TabsList>
        
        {/* Grade Calculator */}
        <TabsContent value="calculator">
          <Card className="terminal-window bg-card/70">
            <CardHeader>
              <CardTitle className="text-primary font-orbitron text-lg">
                GRADE_CALCULATOR
              </CardTitle>
              <CardDescription className="font-fira text-white/70 text-xs">
                Calculate required grades for target averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 font-fira text-sm mb-2 block">
                      Select Course
                    </label>
                    <div className="terminal-window bg-card border border-accent/30 rounded-md p-2">
                      <select
                        className="w-full bg-transparent text-white/90 font-fira text-sm outline-none"
                        value={courseForCalculation}
                        onChange={(e) => setCourseForCalculation(e.target.value)}
                      >
                        <option value="">-- Select Course --</option>
                        {coursesData?.courses.map((course: any) => (
                          <option key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/80 font-fira text-sm mb-2 block">
                      Target Grade (0-10)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={targetGrade}
                      onChange={(e) => setTargetGrade(e.target.value)}
                      className="terminal-window bg-card border-accent/30"
                    />
                  </div>
                </div>
                
                <Button 
                  className="bg-primary hover:bg-primary/80 text-black font-fira w-full"
                  onClick={handleCalculate}
                >
                  CALCULATE
                </Button>
                
                {calculateResult && (
                  <div className={`p-3 rounded-md font-fira text-sm ${
                    calculateResult.includes("Error")
                      ? "bg-destructive/20 border border-destructive/50"
                      : calculateResult.includes("not possible")
                        ? "bg-yellow-400/20 border border-yellow-400/50"
                        : "bg-primary/20 border border-primary/50"
                  }`}>
                    {calculateResult}
                  </div>
                )}
                
                {courseForCalculation && (
                  <div className="terminal-window bg-card p-3 border border-accent/20 rounded-lg">
                    <h3 className="text-accent font-orbitron text-sm mb-2">CURRENT STATUS</h3>
                    {coursesData?.courses
                      .find((c: any) => c.id === courseForCalculation)
                      ?.assessments.map((assessment: any, index: number) => (
                        <div key={index} className="flex justify-between font-fira text-xs border-b border-white/10 py-1">
                          <span className="text-white/80">{assessment.name} ({assessment.weight}%)</span>
                          <span className={
                            assessment.score >= 7 ? "text-primary" :
                            assessment.score >= 5 ? "text-yellow-400" : "text-destructive"
                          }>
                            {assessment.score.toFixed(1)}/10
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Terminal */}
        <TabsContent value="terminal">
          <Card className="terminal-window bg-card/70">
            <CardHeader>
              <CardTitle className="text-primary font-orbitron text-lg">
                CLI_TERMINAL
              </CardTitle>
              <CardDescription className="font-fira text-white/70 text-xs">
                Run commands to interact with the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-fira text-xs text-white/80 bg-card p-4 rounded-md border border-primary/30 h-64 overflow-auto">
                <div className="mb-4">
                  <span className="text-primary">system@grad-navigator:~$</span> help
                  <div className="mt-2 ml-2 text-white/70">
                    <p>Available commands:</p>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>- status: Display system status</li>
                      <li>- courses: List all enrolled courses</li>
                      <li>- schedule: Show weekly schedule</li>
                      <li>- progress: Display academic progress</li>
                      <li>- help: Show this help message</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-primary">system@grad-navigator:~$</span> status
                  <div className="mt-2 ml-2 text-white/70">
                    <p>System Status:</p>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>- Current semester: {devToolsData?.systemInfo.semester}</li>
                      <li>- Days remaining: {devToolsData?.systemInfo.daysRemaining}</li>
                      <li>- System version: {devToolsData?.systemInfo.version}</li>
                      <li>- Status: <span className="text-primary">ONLINE</span></li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <span className="text-primary">system@grad-navigator:~$</span> <span className="animate-blink">_</span>
                </div>
              </div>
              
              <div className="flex mt-4">
                <Input
                  className="terminal-window bg-card border-accent/30 font-fira text-xs"
                  placeholder="Type command..."
                  disabled
                />
                <Button className="ml-2 bg-primary hover:bg-primary/80 text-black font-fira text-xs">
                  RUN
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* API Access */}
        <TabsContent value="api">
          <Card className="terminal-window bg-card/70">
            <CardHeader>
              <CardTitle className="text-primary font-orbitron text-lg">
                API_ACCESS
              </CardTitle>
              <CardDescription className="font-fira text-white/70 text-xs">
                Integrate with external systems using our API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="terminal-window bg-card p-4 border border-secondary/30 rounded-lg">
                  <h3 className="text-secondary font-orbitron text-sm mb-3">API_KEY</h3>
                  
                  <div className="flex items-center">
                    <div className="bg-card/50 font-fira text-xs text-white/70 py-2 px-3 rounded-md flex-grow">
                      •••••••••••••••••••••••••••••••••
                    </div>
                    <Button className="ml-2 bg-secondary hover:bg-secondary/80 text-white font-fira text-xs">
                      GENERATE
                    </Button>
                  </div>
                  
                  <p className="text-white/60 font-fira text-xs mt-2">
                    API key is required for all requests. Keep it secret!
                  </p>
                </div>
                
                <div className="terminal-window bg-card p-4 border border-accent/30 rounded-lg">
                  <h3 className="text-accent font-orbitron text-sm mb-3">AVAILABLE_ENDPOINTS</h3>
                  
                  <div className="space-y-2 font-fira text-xs">
                    {devToolsData?.apiEndpoints.map((endpoint: any, index: number) => (
                      <div key={index} className="border-b border-white/10 pb-2">
                        <div className="flex">
                          <span className={`px-2 py-1 rounded-sm mr-2 text-black ${
                            endpoint.method === "GET" ? "bg-primary" :
                            endpoint.method === "POST" ? "bg-secondary" :
                            endpoint.method === "PUT" ? "bg-yellow-400" : "bg-destructive"
                          }`}>
                            {endpoint.method}
                          </span>
                          <span className="text-white/90 font-fira-code">{endpoint.url}</span>
                        </div>
                        <p className="text-white/60 mt-1 ml-11">{endpoint.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-yellow-400/20 border border-yellow-400/50 font-fira text-xs text-white/80">
                  <strong className="text-yellow-400">Note:</strong> API access is currently in beta. Contact system administrator for full documentation.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Study Tips */}
        <TabsContent value="tips">
          <Card className="terminal-window bg-card/70">
            <CardHeader>
              <CardTitle className="text-primary font-orbitron text-lg">
                STUDY_TIPS_ENGINE
              </CardTitle>
              <CardDescription className="font-fira text-white/70 text-xs">
                AI-powered study recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devToolsData?.studyTips.map((tip: any, index: number) => (
                  <div key={index} className="terminal-window bg-card p-4 border border-accent/20 rounded-lg">
                    <h3 className="text-accent font-orbitron text-sm mb-1">TIP_{index + 1}: {tip.title}</h3>
                    <div className="text-white/70 font-fira text-xs mt-2">
                      {tip.description}
                    </div>
                    {tip.relevance && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60 font-fira">Relevance</span>
                          <span className="text-primary font-fira">{tip.relevance}%</span>
                        </div>
                        <Progress value={tip.relevance} indicatorColor="bg-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Balloon Avatars Gallery */}
        <TabsContent value="balloons">
          <Card className="terminal-window bg-card/70">
            <CardHeader>
              <CardTitle className="text-primary font-orbitron text-lg title-caps">
                BALLOON_AVATAR_SYSTEM
              </CardTitle>
              <CardDescription className="font-fira text-white/70 text-xs">
                Customizable avatar balloon system for user representation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="terminal-window bg-card p-4 border border-accent/20 rounded-lg">
                  <h3 className="text-accent font-orbitron text-sm mb-3 title-caps">AVAILABLE_STYLES</h3>
                  <p className="text-white/70 font-fira text-xs mb-4">
                    Explore available balloon avatar styles and customization options below. Each avatar can be customized with different shapes, patterns, decorations, and accessories.
                  </p>
                  
                  <BalloonGallery className="mt-4" />
                </div>
                
                <div className="terminal-window bg-card p-4 border border-accent/20 rounded-lg">
                  <h3 className="text-accent font-orbitron text-sm mb-3 title-caps">USAGE_INSTRUCTIONS</h3>
                  <div className="text-white/70 font-fira text-xs space-y-2">
                    <p>1. Navigate to your profile settings</p>
                    <p>2. Select "Customize Avatar" option</p>
                    <p>3. Choose your preferred balloon shape, color, pattern and accessories</p>
                    <p>4. Save changes to update your profile avatar</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-primary/20 border border-primary/50 font-fira text-xs">
                  <strong className="text-primary">Pro Tip:</strong> Your avatar appearance affects how you're perceived in the collaborative study environments. Choose a style that represents your academic personality!
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <SpeechBubble
        title="DEV_ASSISTANT"
        message="Use the Grade Calculator to determine what scores you need on upcoming assessments to reach your target grade. Tip: Aim for consistent study patterns rather than cramming before exams."
      />
    </div>
  );
};

export default Developer;
