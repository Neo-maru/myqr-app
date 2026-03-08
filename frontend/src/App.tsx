import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Register } from "./pages/Register";
import { Edit } from "./pages/Edit";
import { QRDisplay } from "./pages/QRDisplay";
import { Reactions } from "./pages/Reactions";
import { StaffView } from "./pages/StaffView";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/register", element: <Register /> },
  { path: "/edit", element: <Edit /> },
  { path: "/qr", element: <QRDisplay /> },
  { path: "/reactions", element: <Reactions /> },
  { path: "/users/:token", element: <StaffView /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
