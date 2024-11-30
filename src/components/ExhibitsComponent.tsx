"use client";

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import ExhibitCard from "@/components/ExhibitCard";
import Typography from "@mui/material/Typography";
import { deleteExhibition } from "@/api/exhibitActions";

interface IExhibition {
    id: number;
    imageUrl: string;
    description: string;
    user: {
        id: number;
        username: string;
    };
    commentCount: number;
    createdAt: string;
}

interface ExhibitsComponentProps {
    exhibits: IExhibition[];
    totalPages: number;
    pageParams: number;
    onPageChange: (page: number) => void;
    selectedExhibitId: number | null;
    toggleComments: (id: number) => void;
}

const ExhibitsComponent: React.FC<ExhibitsComponentProps> = ({
                                                                 exhibits: initialExhibits = [],
                                                                 totalPages,
                                                                 pageParams,
                                                                 onPageChange,
                                                                 selectedExhibitId,
                                                                 toggleComments,
                                                             }) => {
    const [exhibits, setExhibits] = useState<IExhibition[]>(initialExhibits); // Додано стан exhibits

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        onPageChange(page);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteExhibition(id);
                setExhibits((prevExhibits) => prevExhibits.filter((exhibit) => exhibit.id !== id));
                alert('Post deleted successfully.');
            } catch (err) {
                console.error('Error deleting post:', err);
                alert('Failed to delete the post. Please try again.');
            }
        }
    };

    return (
        <Box sx={{ flexGrow: 1, px: 5, py: 2 }}>
            {exhibits.length === 0 ? (
                <Typography style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>
                    Not found posts
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {exhibits.map((exhibit) => (
                        <ExhibitCard
                            key={exhibit.id}
                            id={exhibit.id}
                            imageUrl={exhibit.imageUrl}
                            description={exhibit.description}
                            username={exhibit.user.username}
                            toggleComments={toggleComments}
                            selectedExhibitId={selectedExhibitId}
                            handleDelete={() => handleDelete(exhibit.id)}
                        />
                    ))}
                </Grid>
            )}

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={pageParams}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default ExhibitsComponent;
