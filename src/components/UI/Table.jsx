import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

const Table = ({ columns, data, onRowSelect, paginator = false, height, className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedRows, setSelectedRows] = useState([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

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

  const tableRef = useRef();

  const handleScroll = () => {
    const tableBody = tableRef.current.querySelector("tbody");
    const tableHeader = tableRef.current.querySelector("thead");

    if (tableBody && tableHeader) {
      tableHeader.style.transform = `translateY(${tableBody.scrollTop}px)`;
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };
  return (
    <div
      className={`overflow-x-auto border border-slate-200 rounded-xl  ${className}   ` }
      style={{ height: height || "auto" } }
    >
      <div className="relative" ref={tableRef} onScroll={handleScroll}>
        <table className={`min-w-full bg-white` }>
          <thead>
            {columns.map((column, columnIndex) => (
              <th
                key={columnIndex}
                className={`font-semibold text-lg tracking-wider table-cell align-middle text-left py-4 px-4 text-slate-900 border-b border-slate-200 sticky top-0 bg-white ${
                  column.center ? "text-center" : "" 
                }`}
              >
                {column.name}
              </th>
            ))}
          </thead>
          <tbody>
            {currentItems.map((row, rowIndex) => {
              const rowKey = `${row.id_producto}-${rowIndex}`;

              return (
                <tr
                  key={rowKey}
                  className={`cursor-pointer border-b hover:bg-gray-200/80 duration-200 border-blue-gray-200 ${
                    selectedRows.indexOf(row) !== -1 ? "" : ""
                  } `}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((column, columnIndex) => (
                    <td key={`${rowKey}-${columnIndex}`} className="py-3 px-4">
                      {column.content(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {paginator && (
        <div className="flex justify-end w-full items-center">
          <div className="flex items-center justify-between">
            <div className="flex text-sm items-center space-x-4">
              <span>Items por página:</span>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              icon={faAnglesLeft}
              className="aspect-square"
              pill
              color="text"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Button
              icon={faAngleLeft}
              className="aspect-square"
              pill
              color="text"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Button
              icon={faAngleRight}
              className="aspect-square"
              pill
              color="text"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Button
              icon={faAnglesRight}
              className="aspect-square"
              pill
              color="text"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
