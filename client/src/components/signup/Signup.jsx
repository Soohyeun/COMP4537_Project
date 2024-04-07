import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import signupSchema from "./signupSchema";
import URLContext from "../../contexts/URLContext";
import en from "../../locales/en.json";

export default function Signup() {
	const strings = en.signup;

	const url = useContext(URLContext);
	const navigate = useNavigate();

	return (
		<div className="form-control">
			<Formik
				initialValues={{ name: "", email: "", password: "" }}
				validationSchema={signupSchema}
				onSubmit={(values, actions) => {
					actions.setSubmitting(true);

					fetch(`${url}/auth/register`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(values),
					})
						.then((response) => {
							if (!response.ok) {
								return response.text().then((text) => {
									throw new Error(
										text || "An error occurred"
									);
								});
							}
							return response.json();
						})
						.then((data) => {
							navigate("/login");
							return;
						})
						.catch((error) => {
							actions.setSubmitting(false);
							actions.setStatus(`Error: ${error.message}`);
						});
				}}
			>
				{(formikProps) => (
					<Form>
						<FormControl
							id="name"
							isInvalid={
								formikProps.errors.name &&
								formikProps.touched.name
							}
						>
							<FormLabel>{strings.username}</FormLabel>
							<Input {...formikProps.getFieldProps("name")} />
							<FormErrorMessage>
								{formikProps.errors.name}
							</FormErrorMessage>
						</FormControl>
						<FormControl
							id="email"
							isInvalid={
								formikProps.errors.email &&
								formikProps.touched.email
							}
						>
							<FormLabel>{strings.email}</FormLabel>
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
							<FormLabel>{strings.password}</FormLabel>
							<Input
								type="password"
								{...formikProps.getFieldProps("password")}
								autoComplete="off"
							/>
							<FormErrorMessage>
								{formikProps.errors.password}
							</FormErrorMessage>
						</FormControl>
						<button
							type="submit"
							disabled={formikProps.isSubmitting}
						>
							{strings.signup}
						</button>
						{formikProps.status && (
							<p className="error-message">
								{formikProps.status}
							</p>
						)}
						<Link to="/login">{strings.redirectPrompt}</Link>
					</Form>
				)}
			</Formik>
		</div>
	);
}
