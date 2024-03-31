import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import theme from "./theme";
import URLContext from "./contexts/URLContext";

const { VITE_GATEWAY_URL } = import.meta.env;

ReactDOM.createRoot(document.getElementById("root")).render(
	<URLContext.Provider value={VITE_GATEWAY_URL || 'http://localhost:8888'}>
		<React.StrictMode>
			<ChakraProvider theme={theme}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ChakraProvider>
		</React.StrictMode>
	</URLContext.Provider>
);
