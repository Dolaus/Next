'use client';

import React from 'react';
import {getAllExhibits, getMyExhibits} from '@/api/exhibitActions';
import { useSearchParams, useRouter } from 'next/navigation';
import ExhibitsComponent from "@/components/ExhibitsComponent";

const ExhibitsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);


    const fetchExhibits = async (page: number) => {
        const response = await getMyExhibits(page, localStorage.getItem('token'));
        return {
            data: response.data.data,
            lastPage: response.data.lastPage,
        };
    };

    const handlePageChange = (page: number) => {
        router.push(`/my-post?page=${page}`);
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
