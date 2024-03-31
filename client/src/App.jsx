import { Routes, Route } from "react-router-dom";

import Landing from "./components/landing/Landing";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Admin from "./components/admin/Admin";
import Query from "./components/query/Query";
import AdminProvider from "./contexts/AdminContext";

function App() {
	return (
		<AdminProvider>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />

				<Route path="/admin" element={<Admin />} />
				<Route path="/query" element={<Query />} />

				<Route path="*" element={<Landing />} />
			</Routes>
		</AdminProvider>
	);
}

export default App;
