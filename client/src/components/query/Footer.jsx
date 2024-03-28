import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const QuerySchema = Yup.object().shape({
	query: Yup.string().required("Required"),
});

export default function Footer() {
	const formik = useFormik({
		initialValues: {
			query: "",
		},
		validationSchema: QuerySchema,
		onSubmit: (values) => {
			console.log(values);
		},
	});

	return (
		<footer>
			<form onSubmit={formik.handleSubmit}>
				<div>
					<input
						name="query"
						placeholder={"Query GPT..."}
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
