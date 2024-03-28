import { useState } from "react";

import ChatContainer from "./ChatContainer";
import Footer from "./Footer";

export default function Query() {
	const [chatHistory, setChatHistory] = useState([
		{
			queryCounter: 1,
			query: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			response: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		},
		{
			queryCounter: 2,
			query: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			response: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		},
	]);

	return (
		<div>
			<header>
				<h1>QueriGPT</h1>
			</header>
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
				<Footer />
			</main>
			<Footer />
		</div>
	);
}
