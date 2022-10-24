import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { FavouritesContextProvider } from "./Contexts/FavouritesContext";
import { UpvoteContextProvider } from "./Contexts/UpvoteContext";

import "react-toastify/dist/ReactToastify.css";
import "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { SchoolsContextProvider } from "./Contexts/SchoolsContext";
import { CompareContextProvider } from "./Contexts/CompareContext";
import { SecFiltersContextProvider } from "./Contexts/SecFiltersContext";

ReactDOM.render(
    <SchoolsContextProvider>
        <FavouritesContextProvider>
            <UpvoteContextProvider>
                <CompareContextProvider>
                    <SecFiltersContextProvider>
                        <BrowserRouter>
                            <App />
                            <ToastContainer />
                        </BrowserRouter>
                    </SecFiltersContextProvider>
                </CompareContextProvider>
            </UpvoteContextProvider>
        </FavouritesContextProvider>
    </SchoolsContextProvider>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
