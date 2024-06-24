import AppHeader from "components/AppHeader";
import { Outlet } from "react-router";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <Outlet />
    </div>
  );
}

export default App;
