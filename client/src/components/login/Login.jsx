import { Link, useNavigate } from "react-router-dom";
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.required("Required"),
});

export default function Login() {
	const navigate = useNavigate();

	return (
		<div className="form-control">
			<Formik
				initialValues={{ username: "", email: "", password: "" }}
				validationSchema={SignupSchema}
				onSubmit={(values, actions) => {
					console.log(values);
					actions.setSubmitting(false);
					navigate("/query");
				}}
			>
				{(formikProps) => (
					<Form>
						<FormControl
							id="email"
							isInvalid={
								formikProps.errors.email &&
								formikProps.touched.email
							}
						>
							<FormLabel>Email</FormLabel>
							<Input {...formikProps.getFieldProps("email")} />
							<FormErrorMessage>
								{formikProps.errors.email}
							</FormErrorMessage>
						</FormControl>
						<FormControl
							id="password"
							isInvalid={
								formikProps.errors.password &&
								formikProps.touched.password
							}
						>
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								{...formikProps.getFieldProps("password")}
							/>
							<FormErrorMessage>
								{formikProps.errors.password}
							</FormErrorMessage>
						</FormControl>
						<button
							type="submit"
							disabled={formikProps.isSubmitting}
						>
							LOG IN
						</button>
                        <Link to="/signup">
                            Does not have an account...
                        </Link>
					</Form>
				)}
			</Formik>
		</div>
	);
}
