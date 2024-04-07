import { Link } from "react-router-dom";
import en from "../../locales/en.json";

export default function Landing() {
	const strings = en.landing;

	return (
		<div className="landing">
			<h1 className="landing-title">{strings.title}</h1>
			<Link to="/login" className="landing-login-button">
				{strings.login}
			</Link>
			<Link to="/signup" className="landing-signup-button">
				{strings.signup}
			</Link>
		</div>
	);
}
