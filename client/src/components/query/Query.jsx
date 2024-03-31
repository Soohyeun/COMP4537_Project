import { useState, useContext, useEffect } from "react";

import ChatContainer from "./ChatContainer";
import Header from "./Header";
import Footer from "./Footer";
import URLContext from "../../contexts/URLContext";

export default function Query() {
	const url = useContext(URLContext);
	const [chatHistory, setChatHistory] = useState([]);

	useEffect(() => {
		fetch(`${url}/prompts`, {
			credentials: "include",
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
				setChatHistory(data);
			})
			.catch((error) => {
				console.error("Error getting prompts:", error);
			});
	});

	return (
		<div>
			<Header />
			<main>
				{chatHistory.map((chat, index) => (
					<ChatContainer
						key={index}
						remainingQueryCount={20 - chat.queryCounter}
						query={chat.query}
						response={chat.response}
						deleteChat={() => {
							setChatHistory((prevChatHistory) =>
								prevChatHistory.filter((_, i) => i !== index)
							);
						}}
					/>
				))}
			</main>
			<Footer />
		</div>
	);
}
