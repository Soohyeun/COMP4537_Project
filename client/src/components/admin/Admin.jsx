import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon, RepeatIcon } from "@chakra-ui/icons";
import Header from "../query/Header";
import URLContext from "../../contexts/URLContext";
import { AdminContext } from "../../contexts/AdminContext";

export default function Admin() {
	const navigate = useNavigate();
	const { isAdmin } = useContext(AdminContext);
	const url = useContext(URLContext);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		if (!isAdmin) {
			navigate("/query");
			return;
		}

		fetch(`${url}/users`, {
			method: "GET",
		})
			.then((response) => {
				if (!response.ok) {
					return response.text().then((text) => {
						throw new Error(text || "An error occurred");
					});
				}
				return response.json();
			})
			.then((data) => {
				setUsers(data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [isAdmin, navigate, url]);

	return (
		<div className="admin-dashboard">
			<Header />
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Username</th>
						<th>Email</th>
						<th>Remaining Query Count</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.id}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.remainingQueryCount}</td>
							<td>
								<div className="action-buttons">
									<IconButton
										className="reset-button"
										icon={
											<RepeatIcon
												_hover={{ color: "brand.300" }}
											/>
										}
										aria-label="Reset Query Count"
										onClick={() =>
											setUsers(
												users.map((u) =>
													u.id === user.id
														? {
																...u,
																remainingQueryCount: 20,
														  }
														: u
												)
											)
										}
									/>
									<IconButton
										className="delete-button"
										icon={
											<DeleteIcon
												_hover={{ color: "red.600" }}
											/>
										}
										aria-label="Delete User"
										onClick={() =>
											fetch(`${url}/users/${user.id}`, {
												method: "DELETE",
											}).then(() =>
												setUsers(
													users.filter(
														(u) => u.id !== user.id
													)
												)
											)
										}
									/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
