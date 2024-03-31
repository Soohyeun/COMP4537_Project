import * as Yup from "yup";

const QuerySchema = Yup.object().shape({
	query: Yup.string().required("Required"),
});

export default QuerySchema;