import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon, RepeatIcon } from "@chakra-ui/icons";
import Header from "./Header";

export default function Admin() {
	const [users, setUsers] = useState([
		{
			id: 1,
			username: "Toco",
			email: "toco@my.bcit.ca",
			remainingQueryCount: 0,
		},
		{
			id: 2,
			username: "Terence",
			email: "terence@my.bcit.ca",
			remainingQueryCount: 14,
		},
		{
			id: 3,
			username: "Evon",
			email: "evon@my.bcit.ca",
			remainingQueryCount: 5,
		},
		{
			id: 4,
			username: "Soo",
			email: "soo@my.bcit.ca",
			remainingQueryCount: 20,
		},
	]);

	return (
		<div className="admin-dashboard">
			<Header isAdmin={true} />
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
											setUsers(
												users.filter(
													(u) => u.id !== user.id
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
