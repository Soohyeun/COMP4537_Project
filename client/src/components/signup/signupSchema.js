import * as Yup from "yup";

const signupSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(20, "Too Long!")
		.required("Required"),
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.required("Required"),
});

export default signupSchema;