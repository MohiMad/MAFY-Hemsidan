import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage from "./routes/LandingPage/LandingPage";
import MatematikFilter from "./routes/MatematikFilter/MatematikFilter";
import PageNotFound from "./routes/PageNotFound";
import MatematikFilterYear from "./routes/MatematikFilterYear/MatematikFilterYear";
import MatematikYear from "./routes/MatematikYear/MatematikYear";
import Login from "./routes/Login/Login";
import FysikFilterYear from "./routes/FysikFilterYear/FysikFilterYear";
import Utility from "./Utility";

function RouterController() {
  const [user, setUser] = useState(false);
  const exportedValues = {user};

  useEffect(() => {
    (async () => {
      const userData = await Utility.getUserData();
      // TODO: Remove mock and make it just return nothing.
      if(!userData || userData.code === 404) return;

      setUser(userData);
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App {...exportedValues} />}>
          <Route index element={<LandingPage {...exportedValues} />} />
          <Route path="matematik">
            <Route index element={<MatematikFilter {...exportedValues} />} />

            <Route path="år">
              <Route
                index
                element={<MatematikFilterYear {...exportedValues} />}
              />
              <Route path=":year">
                <Route index element={<MatematikYear isFysik={false} {...exportedValues} />} />
                <Route
                  path=":qNum"
                  element={<MatematikYear isFysik={false} {...exportedValues} />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="fysik">
            {/* <Route index element={<FysikFilter {...exportedValues} />} /> */}
            <Route path="år">
              <Route
                index
                element={<FysikFilterYear {...exportedValues} />}
              />
              <Route path=":year">
                <Route index element={<MatematikYear isFysik={true} {...exportedValues} />} />
                <Route
                  path=":qNum"
                  element={<MatematikYear isFysik={true} {...exportedValues} />}
                />
              </Route>
            </Route>


          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<RouterController />, document.getElementById("root"));
