import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/NotFound";
import TemplateList from "./pages/Template/TemplateList";
import TemplateDetail from "./pages/Template/TemplateDetail/TemplateDetail";
import TemplateEdit from "./pages/Template/TemplateEdit";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/templates" element={<TemplateList />} />
                <Route path="/templates/:id" element={<TemplateDetail />} />
                <Route path="/templates/:id/edit" element={<TemplateEdit />} />
                <Route path="/templates/new" element={<TemplateEdit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
