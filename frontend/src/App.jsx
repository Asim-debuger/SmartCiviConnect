import AppRoutes from "./routes/AppRoutes";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ScrollToTop from "./components/public/ScrollToTop";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <ToastProvider>
          <ScrollToTop />
          <AppRoutes />
        </ToastProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
