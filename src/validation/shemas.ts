import * as Yup from "yup";

export const validationSchema = Yup.object({
    email: Yup.string()
        .min(4, 'email must be at least 4 characters')
        .required('Required'),
    password: Yup.string()
        .min(4, 'Password must be at least 4 characters')
        .required('Required')
});