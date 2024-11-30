"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CommentPage from "@/components/CommentPage";
import {RootState} from "@/store/store";
import {useSelector} from "react-redux";

interface ExhibitCardProps {
    id: number;
    imageUrl: string;
    description: string;
    username: string;
    toggleComments: (id: number) => void;
    selectedExhibitId: number | null;
    handleDelete: (id: number) => void;
}

const ExhibitCard: React.FC<ExhibitCardProps> = ({
                                                     id,
                                                     imageUrl,
                                                     description,
                                                     username,
                                                     toggleComments,
                                                     selectedExhibitId,
                                                     handleDelete,
                                                 }) => {
    const currentUser = useSelector((state: RootState) => state.user.username);

    return (
        <Grid item xs={12}>
            <Box
                sx={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#fff',
                    textAlign: 'center',
                }}
            >
                <img
                    src={`http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com${imageUrl}`}
                    alt={description}
                    style={{
                        width: '600px',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
                <Typography variant="h6" sx={{mt: 2}}>
                    {description}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => toggleComments(id)}
                    sx={{mt: 1}}
                >
                    {selectedExhibitId === id ? 'Hide Comments' : 'Show Comments'}
                </Button>

                {selectedExhibitId === id && (
                    <Box sx={{mt: 2, mr: 2}}>
                        <CommentPage id={id}/>
                    </Box>
                )}
                {currentUser === username && (
                    <Button
                        color="error"
                        onClick={() => handleDelete(id)}
                        sx={{mt: 1}}
                    >
                        Delete Post
                    </Button>
                )}
            </Box>
        </Grid>
    );
};

export default ExhibitCard;
