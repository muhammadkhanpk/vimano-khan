import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiFillAppstore,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import useGetAllWines from "../../hooks/useGetAllWines";
import Pagination from "../pagination/Pagination";
import WineTable from "../tables/WineTable";
import FullPageLoading from "../Loading/FullPageLoading";
import "./homeListing.css";
import GridWineTable from "../tables/GridWineTable";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function HomeListing() {
  const wines = useGetAllWines(1);
  const [search, setSearch] = useState("");
  const [flagGrid, setFlagGrid] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [brands, setBrands] = useState("");
  const [years, setYears] = useState("");
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState("");
  const { user } = useSelector((state) => state.userReducer);
  // const [brand2, setBrand2] = useState("");
  //console.log("abc deff", brand2);
  const navigate = useNavigate();
  const [year2, setYear2] = useState("");
  const [location2, setLocation2] = useState("");
  useEffect(() => {
    const b = [
      ...new Set(
        wines
          .filter((w) => w.isActive && w.wineType !== undefined)
          .map((w) => w.wineType)
      ),
    ];
    const y = [
      ...new Set(
        wines
          .filter((w) => w.isActive)
          .map((w) => w.manufacturingYear)
          .sort((a, b) => b - a)
      ),
    ];
    const l = [
      ...new Set(wines.filter((w) => w.isActive).map((w) => w.locationName)),
    ];

    setBrands(b);
    setYears(y);
    setLocations(l);
    return () => {
      setBrands("");
    };
  }, [wines]);
  //console.log("wine types ", brands);
  const uniqueItems = (wines) => {
    //console.log(search);
    let keyss = [
      "brand",
      "description",
      "locationName",
      "manufacturingYear",
      "name",
      "price",
      "wineType",
    ];
    return wines.filter((w) => {
      if (search == "") {
        return w;
      } else if (
        keyss.some((k) =>
          w[k]
            .toString()
            .toLowerCase()
            .includes(search.toString().toLocaleLowerCase())
        )
      ) {
        return w;
      }
    });
  };
  return (
    <>
      <div className="sorting-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Cerca un buon vino"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">
            <AiOutlineSearch className="icon-style" />
          </button>
        </div>
        <div className="search-menues">
          <select
            name="brands"
            id="brands"
            className="select-options"
            onChange={(e) => setSearch(e.target.value)}
          >
            <option selected disabled>
              Tipologia
            </option>
            {brands.length > 0 &&
              brands.map((brand, index) => (
                <option key={brand + index + 1}>{brand}</option>
              ))}
          </select>
          <select
            name="brands"
            id="brands"
            className="select-options"
            onChange={(e) => setSearch(e.target.value)}
          >
            <option selected disabled>
              Annata
            </option>
            {years.length > 0 &&
              years.map((year, index) => (
                <option key={Math.random() * 10000000}>{year}</option>
              ))}
          </select>
          <select
            name="brands"
            id="brands"
            className="select-options"
            onChange={(e) => setSearch(e.target.value)}
          >
            <option selected disabled>
              Dove si trova
            </option>
            {locations.length > 0 &&
              locations.map((location, index) => (
                <option key={location + index + 1}>{location}</option>
              ))}
          </select>
        </div>
      </div>

      <div className="table-container-wine">
        <div className="table-sorting-heading">
          {search ? (
            <h4>
              Bottiglie trovate:&nbsp;
              <span>{uniqueItems(wines).length}</span>
              <span
                className="btn-clear"
                onClick={() => {
                  user.email ? navigate("/") : setSearch("");
                }}
              >
                [
                <span
                  style={{ padding: "1px 2px", textDecoration: "underline" }}
                >
                  rimuovi filtri
                </span>
                ]
              </span>
            </h4>
          ) : (
            /* <h4>Fresh Recommendations</h4> */
            <h4>Bottiglie trovate</h4>
          )}
          {flagGrid ? (
            <AiOutlineUnorderedList
              className="icon-style"
              onClick={() => setFlagGrid(!flagGrid)}
            />
          ) : (
            <AiFillAppstore
              className="icon-style"
              onClick={() => setFlagGrid(!flagGrid)}
            />
          )}
        </div>
      </div>
      {
        <>
          {flagGrid
            ? wines.length > 0 && (
                <GridWineTable
                  data={uniqueItems(wines)}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  search={search}
                  setSearch={setSearch}
                />
              )
            : wines.length > 0 && (
                <WineTable
                  data={uniqueItems(wines)}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  search={search}
                  setSearch={setSearch}
                />
              )}
          {flagGrid
            ? wines.length > 0 && (
                <Pagination
                  data={uniqueItems(wines)}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  setCurrentPage={setCurrentPage}
                />
              )
            : wines.length > 0 && (
                <Pagination
                  data={uniqueItems(wines)}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
        </>
      }
    </>
  );
}

export default HomeListing;
