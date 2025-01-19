import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// import casper from './assets/esm'
// console.log(casper);

// import {title , fn} from './assets/esm.js'
// console.log(title);
// fn();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
