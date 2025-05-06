import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Home from "@/pages/Home";
import Attendance from "@/pages/Attendance";
import Notes from "@/pages/Notes";
import Progress from "@/pages/Progress";
import Analytics from "@/pages/Analytics";
import Developer from "@/pages/Developer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/notes" component={Notes} />
      <Route path="/progress" component={Progress} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/developer" component={Developer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 flex-grow pb-24">
        <Router />
      </main>
      <BottomNavigation />
      <Toaster />
    </div>
  );
}

export default App;
