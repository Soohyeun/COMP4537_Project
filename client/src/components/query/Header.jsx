import { Link } from "react-router-dom";
import PropType from "prop-types";

Header.propTypes = {
	isAdmin: PropType.bool.isRequired,
};

export default function Header({ isAdmin }) {
	return (
		<header>
			<h1>QueriGPT</h1>
			<nav>
				<ul>
					{isAdmin && (
						<li>
							<Link to="/admin">Admin</Link>
						</li>
					)}
					<li>
						<Link to="/query">Query</Link>
					</li>
					<li>
						<Link
							to="/"
							onClick={() => {
								console.log("Logging out...");
							}}
						>
							Logout
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
