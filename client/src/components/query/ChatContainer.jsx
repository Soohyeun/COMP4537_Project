import { useState, useContext } from "react";
import URLContext from "../../contexts/URLContext";
import PropTypes from "prop-types";
import en from "../../locales/en.json";

ChatContainer.propTypes = {
	chatHistoryCount: PropTypes.number,
	query: PropTypes.string.isRequired,
	response: PropTypes.string.isRequired,
	deleteChat: PropTypes.func.isRequired,
};

export default function ChatContainer(props) {
	const strings = en.chat;

	const url = useContext(URLContext);
	const { chatHistoryCount, response, deleteChat } = props;
	const [query, setQuery] = useState(props.query);
	const [disabled, setDisabled] = useState(true);

	const resendQuery = () => {
		if (query === "") {
			console.log("No query to resend!");
			return;
		}

		fetch(`${url}/prompts`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query }),
		})
			.then(async (response) => {
				if (!response.ok) {
					return response.text().then((text) => {
						throw new Error(text || "An error occurred");
					});
				}
				return response.json();
			})
			.then((data) => {
				setDisabled(true);
			})
			.catch((error) => {
				console.error("Error sending query:", error);
			});
	};

	return (
		<div className="chat-container">
			<p className="query-count">
				{strings.number}
				{chatHistoryCount}
			</p>
			<div className="chat-message user">
				<label>{strings.labels.user}</label>
				<textarea
					type="text"
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);
						if (disabled) {
							setDisabled(false);
						}
					}}
				/>
			</div>
			<div className="chat-message bot">
				<label>{strings.labels.bot}</label>
				<p>{response}</p>
			</div>
			<div className="buttons">
				<button
					className="resend-button"
					onClick={resendQuery}
					disabled={disabled}
				>
					{strings.buttons.resend}
				</button>
				<button className="delete-button" onClick={deleteChat}>
					{strings.buttons.delete}
				</button>
			</div>
		</div>
	);
}
