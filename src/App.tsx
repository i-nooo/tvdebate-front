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
      <Route path="/">
        <ConceptualRecurrencePlot></ConceptualRecurrencePlot>
      </Route>
    </Router>
  );
}

export default App;
