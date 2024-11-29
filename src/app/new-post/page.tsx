"use client";

import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { uploadExhibition } from "@/api/exhibitActions";
import { useRouter } from "next/navigation";

const NewPostPage = () => {
    const router = useRouter();

    const validationSchema = Yup.object({
        description: Yup.string()
            .required('Опис є обов’язковим')
            .min(5, 'Опис має бути не менше 5 символів'),
        image: Yup.mixed()
            .required('Будь ласка, завантажте зображення')
            .test('fileType', 'Підтримуються лише зображення', (value) =>
                value ? ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type) : false
            ),
    });

    const formik = useFormik({
        initialValues: {
            description: '',
            image: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await uploadExhibition(values.image, values.description);
                router.push('/my-post');
            } catch (error) {
                alert('Сталася помилка при завантаженні. Спробуйте ще раз.');
                console.error('Upload error:', error);
            }
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            formik.setFieldValue('image', event.target.files[0]);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                maxWidth: 500,
                mx: 'auto',
                mt: 5,
            }}
        >
            <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
                Створити новий пост
            </Typography>

            <TextField
                label="Опис"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
            />

            <Button
                variant="contained"
                component="label"
                sx={{ width: '100%' }}
            >
                Завантажити зображення
                <input
                    type="file"
                    hidden
                    onChange={handleImageChange}
                    accept="image/*"
                />
            </Button>
            {formik.touched.image && formik.errors.image && (
                <Typography variant="body2" color="error">
                    {formik.errors.image}
                </Typography>
            )}

            {formik.values.image && (
                <Typography variant="body2" color="text.secondary">
                    Обране зображення: {formik.values.image.name}
                </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth>
                Створити пост
            </Button>
        </Box>
    );
};

export default NewPostPage;
