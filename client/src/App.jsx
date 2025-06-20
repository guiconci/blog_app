import { Outlet, useLocation } from "react-router-dom";
import { useUnsavedChanges } from "./context/unsavedChangesContext";
import Header from "./components/Header";
import { useEffect } from "react";
import Footer from "./components/Footer";


function App() {
  const { hasChanges } = useUnsavedChanges();
  const location = useLocation();
  const { pathname } = location;

  return (
    <>
      <div className={`min-h-screen text-textMain-light dark:text-textMain-dark
                      ${pathname === "/" ? "bg-background-light dark:bg-background-dark"
          : "bg-background-light dark:bg-background-subtleDark"}`}
      >
        {/* Optional layout/header logic here */}
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
