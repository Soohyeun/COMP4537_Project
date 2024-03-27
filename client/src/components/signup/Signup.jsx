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
	username: Yup.string()
		.min(2, "Too Short!")
		.max(20, "Too Long!")
		.required("Required"),
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.required("Required"),
});

export default function Signup() {
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
							id="username"
							isInvalid={
								formikProps.errors.username && formikProps.touched.username
							}
						>
							<FormLabel>Username</FormLabel>
							<Input {...formikProps.getFieldProps("username")} />
							<FormErrorMessage>
								{formikProps.errors.username}
							</FormErrorMessage>
						</FormControl>
						<FormControl
							id="email"
							isInvalid={
								formikProps.errors.email && formikProps.touched.email
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
								formikProps.errors.password && formikProps.touched.password
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
						<button type="submit" disabled={formikProps.isSubmitting}>
							SIGN UP
						</button>
                        <Link to="/login">
                            Already have an account...
                        </Link>
					</Form>
				)}
			</Formik>
		</div>
	);
}
