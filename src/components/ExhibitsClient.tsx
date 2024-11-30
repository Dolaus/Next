'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import ExhibitsComponent from '@/components/ExhibitsComponent';
import {getAllExhibits} from '@/api/exhibitActions';
import useSocket from '@/hooks/useSocket';

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

interface ExhibitsClientProps {
    currentPage: number;
}

const ExhibitsClient: React.FC<ExhibitsClientProps> = ({currentPage}) => {
    const [exhibits, setExhibits] = useState<IExhibition[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedExhibitId, setSelectedExhibitId] = useState<number | null>(null);

    const router = useRouter();

    const toggleComments = (id: number) => {
        setSelectedExhibitId((prev) => (prev === id ? null : id));
    };

    const fetchExhibits = async (page: number) => {
        setLoading(true);
        try {
            const response = await getAllExhibits(page);
            setExhibits(response.data.data);
            setTotalPages(response.data.lastPage);
        } catch (err) {
            console.error('Error fetching exhibits:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentPage) {
            console.error('Invalid currentPage value:', currentPage);
            return;
        }
        fetchExhibits(currentPage);
    }, [currentPage]);


    useSocket(currentPage, fetchExhibits);

    const handlePageChange = (page: number) => {
        router.push(`/exhibits?page=${page}`);
        fetchExhibits(page);
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

export default ExhibitsClient;