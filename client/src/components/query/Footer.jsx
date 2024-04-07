import { useContext } from "react";
import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import QuerySchema from "./querySchema";
import URLContext from "../../contexts/URLContext";
import PropTypes from "prop-types";
import en from "../../locales/en.json";

export default function Footer({ onQuerySent }) {
	const strings = en.footer;

	const url = useContext(URLContext);
	const formik = useFormik({
		initialValues: {
			query: "",
		},
		validationSchema: QuerySchema,
		onSubmit: (values) => {
			fetch(`${url}/prompts`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
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
					formik.resetForm();
					onQuerySent();
				});
		},
	});

	return (
		<footer>
			<form onSubmit={formik.handleSubmit}>
				<div>
					<input
						name="query"
						placeholder={strings.placeholder}
						value={formik.values.query}
						onChange={formik.handleChange}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								formik.handleSubmit();
							}
						}}
					/>
					<IconButton
						icon={<ArrowUpIcon />}
						aria-label="Send Message"
						variant="solid"
						bg={"brand.300"}
						type="submit"
						isDisabled={formik.isSubmitting || !formik.isValid}
					/>
				</div>
			</form>
		</footer>
	);
}

Footer.propTypes = {
	onQuerySent: PropTypes.func.isRequired,
};