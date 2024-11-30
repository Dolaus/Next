'use client';

import React, { useState } from 'react';
import ExhibitsComponent from '@/components/ExhibitsComponent';

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
    exhibits: IExhibition[];
    totalPages: number;
    pageParams: number;
}

const ExhibitsClient: React.FC<ExhibitsClientProps> = ({ exhibits, totalPages, pageParams }) => {
    const [selectedExhibitId, setSelectedExhibitId] = useState<number | null>(null);

    const toggleComments = (id: number) => {
        setSelectedExhibitId((prev) => (prev === id ? null : id));
    };

    const handlePageChange = (page: number) => {
        window.location.href = `/exhibits?page=${page}`;
    };

    return (
        <ExhibitsComponent
            exhibits={exhibits}
            totalPages={totalPages}
            pageParams={pageParams}
            onPageChange={handlePageChange}
            selectedExhibitId={selectedExhibitId}
            toggleComments={toggleComments}
        />
    );
};

export default ExhibitsClient;
