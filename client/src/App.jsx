import { Routes, Route } from "react-router-dom";

import Landing from "./components/landing/Landing";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Query from "./components/query/Query";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/query" element={<Query />} />

			<Route path="*" element={<Landing />} />
		</Routes>
	);
}

export default App;
