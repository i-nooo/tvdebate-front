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
// import ModalBubble from "./views/ConceptualRecurrencePlot/ModalBubble";
import Timeline from "./views/Timeline/Timeline";
import Home from "./views/Home/Home";
import FunctionComponentTemplate from "./views/FunctionComponentTemplate/FunctionComponentTemplate";
import ClassComponentTemplate from "./views/ClassComponentTemplate/ClassComponentTemplate";
import TranscriptViewerM from "./views/TranscriptViewerM/TranscriptViewerM";
import TranscriptSubjectTest from "./views/TranscriptSubjectTest/TranscriptSubjectTest";
import DescriptionForManualTopicSegmentation from "./views/TestDescription/TestDescription";
import VideoSubjectTest from "./views/VideoSubjectTest/VideoSubjectTest";
import SubjectTestEnd from "./views/SubjectTestEnd/SubjectTestEnd";
import SampleViewOfTopicSegmentation from "./views/SampleViewOfTopicSegmentation/SampleViewOfTopicSegmentation";
import ConceptualMapModal from "./views/ConceptualRecurrencePlot/ConceptualMapModal/ConceptualMapModal";

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
