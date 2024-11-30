import React from 'react';
import ExhibitsClient from "@/components/ExhibitsClient";

const ExhibitsPage = async ({searchParams}: { searchParams: { page?: string } }) => {
    const currentPage = parseInt(searchParams.page || '1', 10);
    return (
        <ExhibitsClient
            currentPage={currentPage}/>
    );
};

export default ExhibitsPage;
