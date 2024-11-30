import React from 'react';
import ExhibitsClient from "@/components/ExhibitsClient";
import { getAllExhibits } from '@/api/exhibitActions';

const ExhibitsPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
    const currentPage = parseInt(searchParams.page || '1', 10);

    const response = await getAllExhibits(currentPage);
    const exhibits = response?.data?.data || [];
    const lastPage = response?.data?.lastPage || 1;

    // Передаємо дані в клієнтський компонент
    return (
        <ExhibitsClient
            exhibits={exhibits}
            totalPages={lastPage}
            pageParams={currentPage}
        />
    );
};

export default ExhibitsPage;
