import React from 'react';
import ExhibitsMyClient from "@/components/ExhibitsMyClient";

const ExhibitsPage = ({searchParams}: { searchParams: { page?: string } }) => {
    const currentPage = parseInt(searchParams.page || '1', 10);
    return <ExhibitsMyClient currentPage={currentPage}/>;
};

export default ExhibitsPage;
