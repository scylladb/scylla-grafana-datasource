import React from 'react';
interface Props {
    currentPage: number;
    numberOfPages: number;
    onNavigate: (toPage: number) => void;
}
export declare const Pagination: React.FC<Props>;
export {};
