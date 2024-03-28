import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	colors: {
		brand: {
			100: "#202123", // --color-bg
			200: "#343541", // --color-bg-variant
			300: "#10a37f", // --color-primary
			400: "#f7bc05", // --color-secondary
			500: "#ffffff", // --color-text
			600: "#e9e9eb", // --color-text-variant
			700: "#4d4d4d", // --color-border
			800: "#b3b3b3", // --color-border-variant
		},
	},
	styles: {
		global: {
			body: {
				backgroundColor: "brand.100",
				color: "brand.500",
				margin: "auto",
				letterSpacing: "0.1rem",
				height: "100vh",
				window: "100vw",
			},
			"*": {
				fontFamily: "monospace",
				margin: 0,
				padding: 0,
				boxSizing: "border-box",
				letterSpacing: "0.1rem",
				listStyle: "none",
				textDecoration: "none",
			},
			header: {
				backgroundColor: "brand.100",
				padding: "1.25rem",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				position: "fixed",
				top: 0,
				zIndex: 1,
				width: "100%",
			},
			"header h1": {
				color: "brand.300",
				fontSize: "1.5rem",
			},
			"nav ul": {
				display: "flex",
			},
			"nav ul li": {
				marginLeft: "1.25rem",
			},
			"nav ul li a": {
				color: "brand.600",
				transition: "color 0.3s",
				_hover: {
					color: "brand.500",
				},
			},
			main: {
				margin: "3rem auto",
				padding: "2.5rem 1.25rem 7rem",
				width: "90%",
				maxWidth: "50rem",
			},
			".chat-container": {
				display: "flex",
				flexDirection: "column",
				padding: "1rem 1.25rem",
				margin: "0 0 4rem",
				border: "0.1px solid",
				borderRadius: "0.625rem",
				width: "100%",
				textarea: {
					marginTop: "0.625rem",
					backgroundColor: "inherit",
					color: "brand.500",
					width: "100%",
					resize: "none",
					border: "none",
					_focus: {
						outline: "1px solid",
						outlineColor: "brand.400",
						padding: "0.625rem",
					},
				},
        ".buttons": {
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
          button: {
            padding: "0.5rem",
            border: "1px solid",
            borderColor: "brand.700",
            borderRadius: "5px",
            color: "brand.700",
          },
          ".resend-button": {
            _hover: {
              borderColor: "brand.300",
              color: "brand.300",
              opacity: "0.7",
            },
          },
          ".delete-button": {
            _hover: {
              borderColor: "red.600",
              color: "red.600",
              opacity: "0.7",
            },
          },
        },
			},
			".query-count": {
				color: "brand.800",
				marginBottom: "1rem",
			},
			".chat-message": {
				backgroundColor: "brand.100",
				padding: "0.625rem",
				marginBottom: "0.625rem",
			},
			".bot label": {
				color: "brand.300",
			},
			".user label": {
				color: "brand.400",
			},
			footer: {
				padding: "1.25rem",
				textAlign: "center",
				backgroundColor: "brand.100",
				color: "brand.600",
				position: "fixed",
				bottom: 0,
				width: "100%",
				zIndex: 1,
				div: {
					position: "flex",
					flexDirection: "row",
					input: {
						padding: "1rem",
						marginTop: "0.625rem",
						borderRadius: "15px",
						border: "0.1px solid",
						borderColor: "brand.700",
						backgroundColor: "inherit",
						color: "brand.500",
						fontSize: "1rem",
						width: "90%",
						maxWidth: "50rem",
						_focus: {
							outline: "none",
							borderColor: "brand.800",
						},
					},
					button: {
						backgroundColor: "brand.300",
						marginLeft: "1rem",
					},
				},
			},
			".landing": {
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			},
			".landing-title": {
				color: "brand.300",
				fontSize: "5rem",
				marginBottom: "1.25rem",
			},
			".landing a": {
				borderRadius: "5px",
				padding: "1rem",
				textAlign: "center",
				width: "20rem",
			},
			".landing-login-button": {
				backgroundColor: "brand.300",
				color: "brand.100",
				margin: "0.625rem",
				transition: "background-color 0.3s",
				_hover: {
					color: "brand.500",
					opacity: "0.7",
				},
			},
			".landing-signup-button": {
				backgroundColor: "brand.100",
				color: "brand.300",
				margin: "0.625rem",
				border: "0.1px solid",
				borderColor: "brand.300",
				transition: "background-color 0.3s",
				_hover: {
					backgroundColor: "brand.300",
					color: "brand.100",
					opacity: "0.7",
				},
			},
			".form-control": {
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
				height: "100vh",
			},
			".form-control form": {
				width: "30rem",
				maxWidth: "70%",
			},
			".form-control div": {
				marginBottom: "1.25rem",
				width: "100%",
			},
			".form-control label": {
				color: "brand.300",
			},
			".form-control input": {
				backgroundColor: "brand.200",
				color: "brand.500",
				borderColor: "brand.700",
				_focus: {
					borderColor: "brand.800",
				},
			},
			".form-control button": {
				backgroundColor: "brand.300",
				color: "brand.100",
				padding: "0.7rem",
				borderRadius: "5px",
				border: "none",
				cursor: "pointer",
				transition: "background-color 0.3s",
				margin: "1.7rem auto",
				width: "100%",
				_hover: {
					color: "brand.500",
					opacity: "0.7",
				},
			},
			".form-control a": {
				color: "brand.600",
				transition: "color 0.3s",
				_hover: {
					color: "brand.400",
				},
			},
		},
	},
	components: {
		Input: {
			variants: {
				filled: {
					field: {
						_focus: {
							borderColor: "brand.800",
						},
					},
				},
			},
			defaultProps: {
				variant: "filled",
			},
		},
		InputGroup: {
			baseStyle: {
				input: {
					padding: "1rem",
					marginTop: "0.625rem",
					borderRadius: "15px",
					border: "0.1px solid",
					borderColor: "brand.700",
					backgroundColor: "inherit",
					color: "brand.500",
					fontSize: "1rem",
					width: "100%",
					maxWidth: "50rem",
				},
			},
		},
		IconButton: {
			baseStyle: {
				icon: {
					color: "brand.300",
				},
			},
			defaultProps: {
				size: "sm",
				variant: "unstyled",
			},
		},
	},
});

export default theme;
