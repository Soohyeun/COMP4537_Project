import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import loginSchema from "./loginSchema";
import URLContext from "../../contexts/URLContext";
import { AdminContext } from "../../contexts/AdminContext";

export default function Login() {
	const url = useContext(URLContext);
	const { setIsAdmin } = useContext(AdminContext);
	const navigate = useNavigate();

	return (
		<div className="form-control">
			<Formik
				initialValues={{ email: "", password: "" }}
				validationSchema={loginSchema}
				onSubmit={(values, actions) => {
					console.log(values);
					actions.setSubmitting(false);

					fetch(`${url}/auth/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
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
							if (data.isAdmin) {
								setIsAdmin(true);
								navigate("/admin");
								return;
							}
							
							navigate("/admin");
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
							LOG IN
						</button>
						{formikProps.status && (
							<p className="error-message">{formikProps.status}</p>
						)}
						<Link to="/signup">
							{/* eslint-disable-next-line react/no-unescaped-entities */}
							Don't have an account? Sign Up
						</Link>
					</Form>
				)}
			</Formik>
		</div>
	);
}
