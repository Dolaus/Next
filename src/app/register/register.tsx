'use client';

import React from 'react';
import Container from "@mui/material/Container";
import {CssBaseline, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {login} from "@/store/slices/userSlice";
import {useAppDispatch} from "@/hooks/hooks";
import {register} from "@/api/userActions";
import {ErrorMessage, Form, Formik} from "formik";
import {validationSchema} from "@/validation/shemas";
import {useRouter} from "next/navigation";

interface IRegister {
    email: string,
    password: string
}

export default function RegistrationPage() {
    const dispatch = useAppDispatch();

    const router = useRouter();

    async function registerHandler(values: IRegister) {
        const user = {username: values.email, password: values.password};

        try {
            const response = await register(values.email, values.password);
            if (response.status !== 400) {
                dispatch(login(user));
                router.push('/');
            }
        } catch (error) {
            console.error(error);
            console.error('Error during registration:', error);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Formik initialValues={{email: "", password: ""}}
                        validationSchema={validationSchema}
                        onSubmit={registerHandler}>
                    {({handleChange, values, touched, errors}) => (

                        <Form>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={values.email}
                                onChange={handleChange}
                                error={touched.password && Boolean(errors.password)}
                                helperText={<ErrorMessage name="password"/>}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={values.password}
                                onChange={handleChange}
                                error={touched.password && Boolean(errors.password)}
                                helperText={<ErrorMessage name="password"/>}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Sign up
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    );
}