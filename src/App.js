import React, {useEffect, useState} from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import {useLocation, Outlet} from "react-router-dom";

function App({user}) {
  const [pathName, setPathName] = useState("");
  const location = useLocation();

  useEffect(() => {
    // A malformed escape sequence in the URL made decodeURIComponent throw,
    // which took the whole page down instead of just showing the raw path.
    let pathname;

    try {
      pathname = decodeURIComponent(location.pathname);
    } catch(e) {
      pathname = location.pathname;
    }

    const titleAndPathName = pathname
      .split(/\//g)
      .map(x => x.charAt(0).toUpperCase() + x.slice(1))
      .join(" / ");

    setPathName(titleAndPathName);

  }, [location, setPathName]);

  return (
    <>
      <Navbar pathName={pathName} user={user} />
      <Outlet setPathName={setPathName} />
      <Footer />
    </>
  );
}

export default App;
