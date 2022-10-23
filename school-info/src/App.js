import "./App.css";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Schools from "./Pages/Schools/SchoolsMainPage";
import Favourites from "./Pages/Favourites";
import Feedback from "./Pages/FeedbackUI";
import Login from "./Pages/UserAccount/Login";
import SignUp from "./Pages/UserAccount/SignUp";
import Reset from "./Pages/UserAccount/ResetPassword";
import Dashboard from "./Pages/UserAccount/Dashboard";
import Error from "./Pages/Error";
import Recommended from "./Pages/Recommended";

import Forum from "./Pages/Forum/ForumUI";
import PostCreate from "./Pages/Forum/CreatePost";
import Post from "./Pages/Forum/PostUI";

/* General Page */
import Primary from "./Pages/Schools/Primary/Primary";
import Secondary from "./Pages/Schools/Secondary/Secondary";
import Tertiary from "./Pages/Schools/Tertiary/Tertiary";

/* Subjects Page */
import PrimarySubjects from "./Pages/Schools/Primary/PrimarySubjects";
import SecondarySubjects from "./Pages/Schools/Secondary/SecondarySubjects";
import TertiarySubjects from "./Pages/Schools/Tertiary/TertiarySubjects";

/* Cut Off Page */
import SecondaryCutOff from "./Pages/Schools/Secondary/SecondaryCutOff";
import TertiaryCutOff from "./Pages/Schools/Tertiary/TertiaryCutOff";

/* CCA Page */
import PrimaryCCA from "./Pages/Schools/Primary/PrimaryCCA";
import SecondaryCCA from "./Pages/Schools/Secondary/SecondaryCCA";
import TertiaryCCA from "./Pages/Schools/Tertiary/TertiaryCCA";

/* Electives Page */
import PrimaryElective from "./Pages/Schools/Primary/PrimaryElective";
import SecondaryElective from "./Pages/Schools/Secondary/SecondaryElective";
import TertiaryElective from "./Pages/Schools/Tertiary/TertiaryElective";

import MoreInformation from "./Components/MoreInformation";
import ChangePassword from "./Pages/UserAccount/ChangePassword";

import Compare from "./Pages/Compare";
import ErrorCompare from "./Pages/ErrorCompare";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route>
          <Route path="schools" element={<Schools />} />

          <Route
            path="/schools/:school_name"
            element={<MoreInformation />}
          ></Route>

          <Route>
            {" "}
            {/* Nested routes for  /schools/primary*/}
            <Route path="schools/primary" element={<Primary />} />
            <Route path="schools/primary/general" element={<Primary />} />
            <Route
              path="schools/primary/subjects-offered"
              element={<PrimarySubjects />}
            />
            <Route path="schools/primary/ccas" element={<PrimaryCCA />} />
            <Route
              path="schools/primary/electives&programmes"
              element={<PrimaryElective />}
            />
          </Route>
          <Route>
            {" "}
            {/* Nested routes for  /schools/secondary*/}
            <Route path="schools/secondary" element={<Secondary />} />
            <Route path="schools/secondary/general" element={<Secondary />} />
            <Route
              path="schools/secondary/cut-off-points"
              element={<SecondaryCutOff />}
            />
            <Route
              path="schools/secondary/subjects-offered"
              element={<SecondarySubjects />}
            />
            <Route path="schools/secondary/ccas" element={<SecondaryCCA />} />
            <Route
              path="schools/secondary/electives&programmes"
              element={<SecondaryElective />}
            />
          </Route>
          <Route>
            {" "}
            {/* Nested routes for  /schools/tertiary*/}
            <Route path="schools/tertiary" element={<Tertiary />} />
            <Route path="schools/tertiary/general" element={<Tertiary />} />
            <Route
              path="schools/tertiary/cut-off-points"
              element={<TertiaryCutOff />}
            />
            <Route
              path="schools/tertiary/subjects-offered"
              element={<TertiarySubjects />}
            />
            <Route path="schools/tertiary/ccas" element={<TertiaryCCA />} />
            <Route
              path="schools/tertiary/electives&programmes"
              element={<TertiaryElective />}
            />
          </Route>
        </Route>
        <Route path="favourites" element={<Favourites />} />
        <Route path="recommended" element={<Recommended />} />
        <Route path="forum" element={<Forum />} />
        <Route path="compare" element={<Compare />} />
        <Route>
          {""}
          <Route path="forum/CreatePost" element={<PostCreate />} />

          <Route path="forum/Post/:title/:postId" element={<Post />} />
        </Route>
        <Route path="feedback" element={<Feedback />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="changePassword" element={<ChangePassword />} />
        <Route exact path="/reset" element={<Reset />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<Error />} />
        <Route path="*" element={<ErrorCompare />} />
      </Routes>
    </>
  );
}

export default App;
