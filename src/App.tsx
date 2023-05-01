/* eslint-disable no-unused-vars */
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from "react-router-dom";
import "./App.scss";
import ConceptualRecurrencePlot from "./views/ConceptualRecurrencePlot/ConceptualRecurrencePlot";
import Home from "./views/Home/Home";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/coocurence_matrix">
            <ConceptualRecurrencePlot></ConceptualRecurrencePlot>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
