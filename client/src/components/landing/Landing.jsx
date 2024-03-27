import { Link } from "react-router-dom";

export default function Landing() {
	return (
		<div className="landing">
			<h1 className="landing-title">QueriGPT</h1>
			<Link to="/login" className="landing-login-button">
				LOGIN
			</Link>
			<Link to="/signup" className="landing-signup-button">
				SIGN UP
			</Link>
		</div>
	);
}
