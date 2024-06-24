import { hasPermission } from "pages/Auth/permissionGuard";
import Restricted from "pages/Errors/Restricted";
import Home from "pages/Pages/home/Home";
import Question from "pages/Pages/question/Question";
import TopicList from "pages/Pages/question/TopicList";
import AddTest from "pages/Pages/tests/AddTest";
import EditTest from "pages/Pages/tests/EditTest";
import PrintTest from "pages/Pages/tests/PrintTest";
import ViewQuestions from "pages/Pages/tests/ViewQuestions";
import { Route, Routes } from "react-router";

import { ProtectedRoutes } from "./ProtectedRoute";
import App from "../App";
import { Login } from "../pages/Auth/Login";
import { NotFound } from "../pages/Errors/NotFound";

export const routes = (
  <Routes>
    <Route element={<ProtectedRoutes />}>
      <Route path="/restricted" element={<Restricted />} />
      <Route path="/" element={<App />}>
        <Route element={hasPermission("") ? <Home /> : <Restricted />} index />
        <Route path="questions">
          <Route
            path="add"
            element={hasPermission("add_questions") ? <Question /> : <Restricted />}
            index
          />
          <Route
            path="edit"
            element={hasPermission("edit_questions") ? <Question /> : <Restricted />}
            index
          />
          <Route
            path="topic"
            element={hasPermission("view_topic") ? <TopicList /> : <Restricted />}
            index
          />
        </Route>
        <Route path="test">
          <Route
            path="add"
            element={hasPermission("add_test") ? <AddTest /> : <Restricted />}
            index
          />
          {/* <Route
            path="edit"
            element={hasPermission("edit_test") ? <EditTest /> : <Restricted />}
            index
          /> */}
          <Route
            path="print"
            element={hasPermission("print_test") ? <PrintTest /> : <Restricted />}
            index
          />
          {/* <Route
            path="view"
            element={hasPermission("view_questions") ? <ViewQuestions /> : <Restricted />}
            index
          /> */}
        </Route>
      </Route>
    </Route>
    <Route path="login" element={<Login />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
