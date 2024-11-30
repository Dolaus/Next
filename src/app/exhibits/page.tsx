'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import CommentPage from "@/components/CommentPage";
import { getAllExhibits } from "@/api/exhibitActions";
import Typography from "@mui/material/Typography";

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

const ExhibitsPage = () => {
    const [exhibits, setExhibits] = useState<IExhibition[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedExhibitId, setSelectedExhibitId] = useState<number | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const fetchExhibits = async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllExhibits(page);

            if (response.data && response.data.data) {
                setExhibits(response.data.data);
                setTotalPages(response.data.lastPage);
            } else {
                setExhibits([]);
                setError('No exhibits found.');
            }
        } catch (err) {
            console.error('Error fetching exhibits:', err);
            setError('Failed to load exhibits. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        router.push(`/exhibits?page=${page}`);
    };

    const toggleComments = (id: number) => {
        setSelectedExhibitId(selectedExhibitId === id ? null : id);
    };

    useEffect(() => {
        fetchExhibits(currentPage);
    }, [currentPage]);

    return (
        <Box sx={{ flexGrow: 1, px: 5, py: 2 }}>
            {loading && <p>Loading exhibits...</p>}

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!loading && !error && exhibits.length > 0 && (
                <Grid container spacing={2}>
                    {exhibits.map((exhibit) => (
                        <Grid item xs={12} key={exhibit.id}>
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
                                    src={`http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com${exhibit.imageUrl}`}
                                    alt={exhibit.description}
                                    style={{
                                        width: '600px',
                                        height: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Typography variant="h6" sx={{ mt: 2 }}>{exhibit.description}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Uploaded by: {exhibit.user.username} | Comments: {exhibit.commentCount}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => toggleComments(exhibit.id)}
                                    sx={{ mt: 1 }}
                                >
                                    {selectedExhibitId === exhibit.id ? 'Hide Comments' : 'Show Comments'}
                                </Button>
                                {selectedExhibitId === exhibit.id && (
                                    <Box sx={{ mt: 2 }}>
                                        <CommentPage id={exhibit.id} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && !error && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default ExhibitsPage;
