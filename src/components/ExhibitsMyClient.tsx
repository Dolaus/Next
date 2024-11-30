'use client';

import React, { useEffect, useState } from 'react';
import ExhibitsComponent from '@/components/ExhibitsComponent';
import { getMyExhibits } from '@/api/exhibitActions';

interface ExhibitsMyClientProps {
    currentPage: number;
}

const ExhibitsMyClient: React.FC<ExhibitsMyClientProps> = ({ currentPage }) => {
    const [exhibits, setExhibits] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedExhibitId, setSelectedExhibitId] = useState<number | null>(null);

    const toggleComments = (id: number) => {
        setSelectedExhibitId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to view your exhibits.');
                setLoading(false);
                return;
            }

            try {
                const response = await getMyExhibits(currentPage, token);
                setExhibits(response.data.data);
                setTotalPages(response.data.lastPage);
            } catch (err) {
                console.error('Error fetching exhibits:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        window.location.href = `/exhibits?page=${page}`;
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <ExhibitsComponent
            exhibits={exhibits}
            totalPages={totalPages}
            pageParams={currentPage}
            onPageChange={handlePageChange}
            selectedExhibitId={selectedExhibitId}
            toggleComments={toggleComments}
        />
    );
};

export default ExhibitsMyClient;
