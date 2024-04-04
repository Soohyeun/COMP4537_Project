import { useContext } from "react";
import { Link } from "react-router-dom";
import URLContext from "../../contexts/URLContext";
import { AdminContext } from "../../contexts/AdminContext";

export default function Header() {
	const { isAdmin } = useContext(AdminContext);
	const url = useContext(URLContext);

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
								fetch(`${url}/logout`, {
									method: "POST",
									credentials: "include",
								}).then((response) => {
									if (!response.ok) {
										throw new Error(
											"Network response was not ok"
										);
									}
									return;
								});
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
