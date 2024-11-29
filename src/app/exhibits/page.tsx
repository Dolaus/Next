'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import CommentPage from "@/components/CommentPage";

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
    const [selectedExhibitId, setSelectedExhibitId] = useState<number | null>(null); // Для відстеження активного поста

    // Next.js hooks for search params and router
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get the `page` parameter from the URL or default to 1
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    // Fetch exhibits from the API
    const fetchExhibits = async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits`,
                {
                    params: { page },
                }
            );

            // Перевірка та обробка відповіді
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

    // Handle page change and update URL
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        router.push(`/exhibits?page=${page}`);
    };

    // Toggle comments visibility
    const toggleComments = (id: number) => {
        setSelectedExhibitId(selectedExhibitId === id ? null : id);
    };

    useEffect(() => {
        fetchExhibits(currentPage);
    }, [currentPage]);

    return (
        <Box sx={{ flexGrow: 1, px: 5, py: 2 }}>
            {/* Loading message */}
            {loading && <p>Loading exhibits...</p>}

            {/* Error message */}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {/* Exhibits grid */}
            {!loading && !error && exhibits.length > 0 && (
                <Grid container spacing={2}>
                    {exhibits.map((exhibit) => (
                        <Grid item xs={12} sm={6} md={4} key={exhibit.id}>
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
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                                <p>{exhibit.description}</p>
                                <p>
                                    <strong>Author:</strong> {exhibit.user.username}
                                </p>
                                <p>
                                    <strong>Comments:</strong> {exhibit.commentCount}
                                </p>
                                <p>
                                    <strong>Date:</strong> {new Date(exhibit.createdAt).toLocaleString()}
                                </p>
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

            {/* Pagination */}
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
