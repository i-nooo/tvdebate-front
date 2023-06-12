import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.scss";
import ConceptualRecurrencePlot from "./views/ConceptualRecurrencePlot/ConceptualRecurrencePlot";

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
