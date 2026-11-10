import RouteTransitionBar from "./components/RouteTransitionBar";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes";

function App() {
  return (
    <>
      <RouteTransitionBar />
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;