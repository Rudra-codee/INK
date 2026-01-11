import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import HomePage from "./pages/dashboard/HomePage";
import AllDocumentsPage from "./pages/dashboard/AllDocumentsPage";
import SharedPage from "./pages/dashboard/SharedPage";
import FavoritesPage from "./pages/dashboard/FavoritesPage";
import TrashPage from "./pages/dashboard/TrashPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import CreateRoomPage from "./pages/rooms/CreateRoomPage";
import RoomLobbyPage from "./pages/rooms/RoomLobbyPage";
import RoomPlayPage from "./pages/rooms/RoomPlayPage";
import RoomResultPage from "./pages/rooms/RoomResultPage";
import PublicStoryPage from "./pages/public/PublicStoryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/docs" element={<Docs />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:docId"
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/all-documents"
              element={
                <ProtectedRoute>
                  <AllDocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/shared"
              element={
                <ProtectedRoute>
                  <SharedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/trash"
              element={
                <ProtectedRoute>
                  <TrashPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <CreateRoomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/new"
              element={
                <ProtectedRoute>
                  <CreateRoomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:roomId/lobby"
              element={
                <ProtectedRoute>
                  <RoomLobbyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:roomId/play"
              element={
                <ProtectedRoute>
                  <RoomPlayPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:roomId/result"
              element={
                <ProtectedRoute>
                  <RoomResultPage />
                </ProtectedRoute>
              }
            />

            {/* PUBLIC ROUTES */}
            <Route path="/story/:slug" element={<PublicStoryPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
