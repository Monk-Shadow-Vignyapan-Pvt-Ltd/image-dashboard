import React from 'react';
import { WithStrokeUpArrow } from './Icons/WithStrokeUpArrow';

const Pagination = ({ currentPage, totalPages, onPageChange, totalEntries, entriesPerPage }) => {
    const startEntry = (currentPage - 1) * entriesPerPage + 1;
    const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-md text-lightText">
                Showing {startEntry} to {endEntry} of {totalEntries} entries
            </span>
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="icon-lg flex items-center justify-center bg-mainBg rounded-lg -rotate-90">
                        <WithStrokeUpArrow width={20} height={20} fill={"none"} stroke={"#F05F23"} />
                    </div>
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onPageChange(index + 1)}
                        className={`icon-lg flex items-center justify-center rounded-lg ${currentPage === index + 1 ? 'bg-accent text-white' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="icon-lg flex items-center justify-center bg-mainBg rounded-lg rotate-90">
                        <WithStrokeUpArrow width={20} height={20} fill={"none"} stroke={"#F05F23"} />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
