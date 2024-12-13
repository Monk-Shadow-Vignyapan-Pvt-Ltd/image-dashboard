import React, { useState } from 'react';
import { ThreeDotsMenu } from '../components/Icons/ThreeDotsMenu';
import Pagination from '../components/Pagination'; // Ensure you import your Pagination component

const ThreeColTable = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const totalEntries = data.length;

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Extract headers from the first data object
    const headers = Object.keys(data[0] || {}).filter(key => key !== 'date').map((key, index) => {
        if (key === 'head1') {
            return 'Project'; // Change to your desired header name
        }
        return key.charAt(0).toUpperCase() + key.slice(1); // Capitalize the key for display
    });

    return (
        <>
            <div className="w-full flex-1 flex flex-col justify-center">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right border-0 bg-cardBg text-primaryText">
                        <thead className="text-md border-b-2 border-l-0 border-r-0 border-border border-2 text-primaryText">
                            <tr>
                                {/* <th scope="col">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-all-search"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="checkbox-all-search" className="sr-only">
                                            checkbox
                                        </label>
                                    </div>
                                </th> */}
                                {headers.map((header, index) => (
                                    <th key={index} scope="col" className="px-6 py-3">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((row, index) => (
                                <tr key={index} className="border-b-2 border-l-0 border-r-0 border-border border-2 hover:bg-gray-50 items-center">
                                    <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap flex flex-col">
                                        <span className="font-semibold text-md">{row.Product}</span>
                                        {row.date && <span className="font-semibold text-md">{row.date}</span>}
                                    </td>
                                    <td className="h-full px-6 py-4">{row.Qty}</td>
                                    <td className="h-full px-6 py-4">{row.Sum}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalEntries={totalEntries}
                entriesPerPage={rowsPerPage}
            />
        </>
    );
};

export default ThreeColTable;
