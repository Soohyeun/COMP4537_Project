import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ChatContainer from "./ChatContainer";
import Header from "./Header";
import Footer from "./Footer";
import URLContext from "../../contexts/URLContext";
import en from "../../locales/en.json";

export default function Query() {
	const strings = en.query;

	const navigate = useNavigate();
	const url = useContext(URLContext);
	const [chatHistory, setChatHistory] = useState([]);
	const [queryCount] = useState(20);

	const fetchHistory = () => {
		fetch(`${url}/prompts`, {
			credentials: "include",
		})
			.then(async (response) => {
				if (!response.ok) {
					if (response.status === 401) {
						navigate("/login");
					}

					return response.text().then((text) => {
						throw new Error(text || "An error occurred");
					});
				}
				return response.json();
			})
			.then((data) => {
				setChatHistory(data);
			})
			.catch((error) => {
				console.error("Error getting chat history:", error);
			});
	};

	useEffect(() => {
		fetchHistory();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Header />
			<main>
				{chatHistory.length + 16 >= 20 ? (
					<p className="query-count warning">{strings.warning}</p>
				) : (
					<p className="query-count">{strings.queryCount}{queryCount - chatHistory.length}</p>
				)}
				{chatHistory.map((chat, index) => (
					<ChatContainer
						key={index}
						chatHistoryCount={index + 1}
						query={chat.question}
						response={chat.answer}
						deleteChat={() => {
							setChatHistory((prevChatHistory) =>
								prevChatHistory.filter((_, i) => i !== index)
							);
						}}
					/>
				))}
			</main>
			<Footer onQuerySent={fetchHistory} />
		</div>
	);
}
