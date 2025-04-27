import react from "react";
import LandingPage from "./Pages/landing/LandingPage";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>{" "}
    </>
  );
}

export default App;
