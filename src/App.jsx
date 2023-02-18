import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Router from "./Router";
import { useDispatch } from "react-redux";
import { authUser } from "./redux/action";
function App() {
  return <Router />;
}

export default App;
