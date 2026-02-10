import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { NavigationProvider } from "./contexts/NavigationContext";
import Home from "./components/home";

function App() {
  return (
    <NavigationProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </NavigationProvider>
  );
}

export default App;
