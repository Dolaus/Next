import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { deleteExhibition } from "@/api/exhibitActions";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ExhibitCard from "@/components/ExhibitCard";
import Typography from "@mui/material/Typography";
import useSocket from "@/hooks/useSocket";

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
    fetchDataCallback: (page: number) => Promise<{
        data: IExhibition[];
        lastPage: number;
    }>;
    pageParams: number;
    onPageChange: (page: number) => void;
}

const ExhibitsComponent: React.FC<ExhibitsComponentProps> = ({ fetchDataCallback, pageParams, onPageChange }) => {
    const [exhibits, setExhibits] = useState<IExhibition[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedExhibitId, setSelectedExhibitId] = useState<number | null>(null);
    const currentUser = useSelector((state: RootState) => state.user.username);

    const fetchExhibits = async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchDataCallback(page);
            setExhibits(response.data);
            setTotalPages(response.lastPage);
        } catch (err) {
            console.error('Error fetching exhibits:', err);
            setError('Failed to load exhibits. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useSocket(pageParams, fetchExhibits);

    useEffect(() => {
        fetchExhibits(pageParams);
    }, [pageParams]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        onPageChange(page);
    };

    const toggleComments = (id: number) => {
        setSelectedExhibitId(selectedExhibitId === id ? null : id);
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
            {loading && <p>Loading exhibits...</p>}

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!loading && !error && exhibits.length === 0 && (
                <Typography style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>Not found posts</Typography>
            )}

            {!loading && !error && exhibits.length > 0 && (
                <Grid container spacing={2}>
                    {exhibits.map((exhibit) => (
                        <ExhibitCard
                            key={exhibit.id}
                            id={exhibit.id}
                            imageUrl={exhibit.imageUrl}
                            description={exhibit.description}
                            username={exhibit.user.username}
                            currentUser={currentUser}
                            toggleComments={toggleComments}
                            selectedExhibitId={selectedExhibitId}
                            handleDelete={handleDelete}
                        />
                    ))}
                </Grid>
            )}

            {!loading && !error && totalPages > 1 && (
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
