import { useContext } from "react";
import { Link } from "react-router-dom";
import URLContext from "../../contexts/URLContext";
import { AdminContext } from "../../contexts/AdminContext";
import en from "../../locales/en.json";

export default function Header() {
	const strings = en.header;

	const { isAdmin } = useContext(AdminContext);
	const url = useContext(URLContext);

	return (
		<header>
			<h1>{strings.title}</h1>
			<nav>
				<ul>
					{isAdmin && (
						<li>
							<Link to="/admin">{strings.navigation.admin}</Link>
						</li>
					)}
					<li>
						<Link to="/query">{strings.navigation.main}</Link>
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
							{strings.navigation.logout}
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
