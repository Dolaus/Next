'use client';

import React from 'react';
import { getAllExhibits } from '@/api/exhibitActions';
import { useSearchParams, useRouter } from 'next/navigation';
import ExhibitsComponent from "@/components/ExhibitsComponent";
import useSocket from "@/hooks/useSocket";

const ExhibitsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    useSocket(currentPage, (page) => fetchExhibits(page));

    const fetchExhibits = async (page: number) => {
        const response = await getAllExhibits(page);
        return {
            data: response.data.data,
            lastPage: response.data.lastPage,
        };
    };

    const handlePageChange = (page: number) => {
        router.push(`/exhibits?page=${page}`);
    };

    return (
        <ExhibitsComponent
            fetchDataCallback={fetchExhibits}
            pageParams={currentPage}
            onPageChange={handlePageChange}
        />
    );
};

export default ExhibitsPage;
