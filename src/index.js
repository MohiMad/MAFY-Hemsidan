import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage from "./routes/LandingPage/LandingPage";
import FirstFilter from "./routes/FirstFilter/FirstFilter";
import PageNotFound from "./routes/PageNotFound";
import FilterYears from "./routes/FilterYears/FilterYears";
import Year from "./routes/Year/Year";
import Utility from "./Utility";
import FormulasSection from "./components/FormulasSection/FormulasSection";
import AnkiPage from "./routes/AnkiPage/AnkiPage";
import UserPolicyPage from "./routes/UserPolicyPage/UserPolicyPage";
import ContactUsPage from "./routes/ContactUsPage/ContactUsPage";
import FilterTopics from "./routes/FilterTopics/FilterTopics";
import Topic from "./routes/Topic/Topic";
// eslint-disable-next-line no-unused-vars
import Statistik from "./routes/Statistik/Statistik";

function RouterController() {
  const [user, setUser] = useState(false);
  const exportedValues = {user};

  useEffect(() => {
    (async () => {
      const userData = await Utility.getUserData();

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
            <Route index element={<FirstFilter {...exportedValues} isMath={true} />} />

            <Route path="år">
              <Route
                index
                element={<FilterYears {...exportedValues} />}
              />
              <Route path=":year">
                <Route index element={<Year isFysik={false} {...exportedValues} />} />
                <Route
                  path=":qNum"
                  element={<Year isFysik={false} {...exportedValues} />}
                />
              </Route>
            </Route>
            <Route path="ämne">
              <Route index element={<FilterTopics {...exportedValues} isMath={true} />} />
              <Route path=":topic">
                <Route index element={<Topic isFysik={false} {...exportedValues} />} />
                <Route
                  path=":qNum"
                  element={<Topic isFysik={false} {...exportedValues} />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="fysik">
            <Route index element={<FirstFilter {...exportedValues} isMath={false} />} />
            <Route path="år">
              <Route
                index
                element={<FilterYears {...exportedValues} />}
              />
              <Route path=":year">
                <Route index element={<Year isFysik={true} {...exportedValues} />} />
                <Route
                  path=":qNum"
                  element={<Year isFysik={true} {...exportedValues} />}
                />
              </Route>
            </Route>
            <Route path="ämne">
              <Route index element={<FilterTopics {...exportedValues} isMath={false} />} />
              <Route path=":topic">
                <Route index element={<Topic isFysik={true} {...exportedValues} />} />
                <Route
                  path=":qNum"
                  element={<Topic isFysik={true} {...exportedValues} />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="formler" element={<FormulasSection />} />
          <Route path="anki" element={<AnkiPage />} />
          <Route path="användaravtal" element={<UserPolicyPage />} />
          <Route path="anvandaravtal" element={<UserPolicyPage />} />
          <Route path="kontakta-oss" element={<ContactUsPage />} />
          <Route path="statistik" element={<Statistik />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<RouterController />, document.getElementById("root"));
