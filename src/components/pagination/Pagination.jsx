import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./pagination.style.css";

const Pagination = ({ data, itemsPerPage, currentPage, setCurrentPage }) => {
  const { user } = useSelector((state) => state.userReducer);
  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  let pages = [];
  data = data.filter((d) => d.isActive);
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pages.push(i);
  }
  const handleClick = (e) => {
    setCurrentPage(Number(e.target.id));
  };

  const handleNextBtn = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevBtn = () => {
    setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  return data.filter((d) => d.isActive).length > itemsPerPage ? (
    <ul className="page__numbers">
      <li>
        <button
          onClick={handlePrevBtn}
          disabled={currentPage === pages[0] ? true : false}
        >
          Indietro
        </button>
      </li>
      {pages.map((number) => {
        {
          /* console.log("number is ", pages.length); */
        }
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
          return (
            <li
              key={number}
              id={number}
              onClick={handleClick}
              className={currentPage === number ? "active" : null}
            >
              {number}
            </li>
          );
        } else {
          return null;
        }
      })}
      <li>
        <button
          onClick={handleNextBtn}
          disabled={currentPage === pages[pages.length - 1]}
        >
          Prossimo
        </button>
      </li>
    </ul>
  ) : (
    <></>
  );
};

export default Pagination;
