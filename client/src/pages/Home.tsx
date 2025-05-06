import React from "react";
import { useQuery } from "@tanstack/react-query";
import CharacterProfile from "@/components/dashboard/CharacterProfile";
import TasksList from "@/components/dashboard/TasksList";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatusDashboard from "@/components/dashboard/StatusDashboard";
import SpeechBubble from "@/components/dashboard/SpeechBubble";
import LoadingBalloon from "@/components/animations/LoadingBalloon";
import { apiRequest } from "@/lib/queryClient";

const Home: React.FC = () => {
  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user", undefined);
      return res.json();
    },
  });

  // Fetch tasks data
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tasks", undefined);
      return res.json();
    },
  });

  // Fetch courses data
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/courses", undefined);
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

  // Fetch notifications
  const { data: notificationData, isLoading: notificationLoading } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications", undefined);
      return res.json();
    },
  });

  const isLoading =
    userLoading || tasksLoading || coursesLoading || scheduleLoading || notificationLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingBalloon message="CARREGANDO_DADOS" />
      </div>
    );
  }

  return (
    <div id="dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-4">
      {/* Left Column */}
      <div className="lg:col-span-3 space-y-6">
        {/* Character Profile */}
        {userData && <CharacterProfile user={userData} />}

        {/* Tasks List */}
        {tasksData && <TasksList tasks={tasksData.tasks} />}
      </div>

      {/* Main Content Column */}
      <div className="lg:col-span-9 space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Status Dashboard */}
        {coursesData && scheduleData && (
          <StatusDashboard
            courses={coursesData.courses}
            weeklySchedule={scheduleData.schedule}
            period={coursesData.period}
          />
        )}

        {/* System Notification */}
        {notificationData && notificationData.notifications.length > 0 && (
          <SpeechBubble
            title={notificationData.notifications[0].title}
            message={notificationData.notifications[0].message}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
