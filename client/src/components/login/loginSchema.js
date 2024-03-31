import * as Yup from "yup";

const loginSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.required("Required"),
});

export default loginSchema;