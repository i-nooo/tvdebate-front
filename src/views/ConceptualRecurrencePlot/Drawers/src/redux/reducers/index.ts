import { combineReducers } from "redux";
// import visibilityFilter from "./visibilityFilter";
// import todos from "./todos";
import standardSimilarityScoreReducer from "./standardSimilarityScoreReducer";

// export default combineReducers({ todos, visibilityFilter });

const combinedReducers = combineReducers({
  standardSimilarityScoreReducer,
});
export default combinedReducers;
