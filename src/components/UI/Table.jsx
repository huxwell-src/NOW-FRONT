import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

const Table = ({ columns, data, onRowSelect, paginator = false, height  }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedRows, setSelectedRows] = useState([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleRowClick = (row) => {
    const selectedIndex = selectedRows.indexOf(row);
    let newSelected = [];
  
    if (selectedIndex === -1) {
      newSelected = [row]; // Only select the clicked row
    }
  
    setSelectedRows(newSelected);
  
    // Callback to inform the parent component about the selected rows
    if (onRowSelect) {
      onRowSelect(newSelected);
    }
  };
  
  useEffect(() => {
    setCurrentPage(1); // Reset currentPage when data changes
  }, [data]);

  const tableRef = useRef();

  const handleScroll = () => {
    const tableBody = tableRef.current.querySelector("tbody");
    const tableHeader = tableRef.current.querySelector("thead");

    if (tableBody && tableHeader) {
      tableHeader.style.transform = `translateY(${tableBody.scrollTop}px)`;
    }
  };

return (
  <div className="overflow-x-auto border border-slate-200 rounded-xl" style={{ height: height || 'auto' }}>
  <div
      className="relative"
      ref={tableRef}
      onScroll={handleScroll}
    >
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-blue-gray-100 text-gray-700">
            {columns.map((column) => (
              <th
                key={column.name}
                className="font-semibold text-lg tracking-wider table-cell align-middle text-left py-4 px-4 text-slate-900 border-b border-slate-200 sticky top-0 bg-white"
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b duration-200 border-blue-gray-200 ${
                selectedRows.indexOf(row) !== -1 ? "bg-gray-100" : ""
              } `}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((column) => (
                <td key={column.name} className="py-3 px-4">
                  {column.content(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      {paginator && (
        <div className="flex sticky tracking-wider  mt-4">
          <div className="flex items-center text-sm justify-end w-full space-x-2">
            <div className="flex items-center">
              <label className="mr-2 ">Filas por página:</label>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              >
                {[25, 50, 100, 200].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <Button
              icon={faAnglesLeft}
              className="aspect-square"
              pill
              color="text"
              onClick={handleFirstPage}
              disabled={currentPage === 1}
            />
            <Button
              icon={faAngleLeft}
              className="aspect-square"
              pill
              color="text"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            />
            <Button
              icon={faAngleRight}
              className="aspect-square"
              pill
              color="text"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            />
            <Button
              icon={faAnglesRight}
              className="aspect-square"
              pill
              color="text"
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;