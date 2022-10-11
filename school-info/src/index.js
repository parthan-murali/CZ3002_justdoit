import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { FavouritesContextProvider } from "./Contexts/FavouritesContext";
import "react-toastify/dist/ReactToastify.css";
import "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { SchoolsContextProvider } from "./Contexts/SchoolsContext";
import { CompareContextProvider } from "./Contexts/CompareContext";

ReactDOM.render(
  <SchoolsContextProvider>
    <FavouritesContextProvider>
      <CompareContextProvider>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
      </CompareContextProvider>
    </FavouritesContextProvider>
  </SchoolsContextProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
