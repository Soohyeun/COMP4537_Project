import { useState } from "react";
import PropTypes from "prop-types";

ChatContainer.propTypes = {
	remainingQueryCount: PropTypes.number.isRequired,
	query: PropTypes.string.isRequired,
	response: PropTypes.string.isRequired,
	deleteChat: PropTypes.func.isRequired,
};

export default function ChatContainer(props) {
	const { remainingQueryCount, response, deleteChat } = props;
	const [query, setQuery] = useState(props.query);
	const [disabled, setDisabled] = useState(true);

	const resendQuery = () => {
        if (remainingQueryCount === 0) {
            console.log("No remaining queries!");
            return;
        }

        if (query === "") {
            console.log("No query to resend!");
            return;
        }

		console.log(`Resending query: ${query}`);
	};

	return (
		<div className="chat-container">
			<p className="query-count">
				Remaining Query Count: {remainingQueryCount}
			</p>
			<div className="chat-message user">
				<label>User</label>
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
				<label>Bot</label>
				<p>{response}</p>
			</div>
			<div className="buttons">
				<button className="resend-button" onClick={resendQuery} disabled={disabled}>
					RESEND
				</button>
				<button className="delete-button" onClick={deleteChat}>
					DELETE
				</button>
			</div>
		</div>
	);
}
