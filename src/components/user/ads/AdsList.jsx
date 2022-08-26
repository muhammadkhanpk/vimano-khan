import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import useGetUserWine from "../../../hooks/useGetUserWine";
import useGetAllWines from "../../../hooks/useGetAllWines";
import useGetFavoriteUserWine from "../../../hooks/useGetFavoriteUserWine";
import BottomBar from "../../bottombar/BottomBar";
import Pagination from "../../pagination/Pagination";
import MyAdsTable from "../../tables/MyAdsTable";
import UserTopbar from "../../topbar/UserTopbar";
import "./adList.css";
import FvtWineTable from "../../tables/FvtWineTable";
import WineTable from "../../tables/WineTable";
import { useEffect } from "react";

function AdsList() {
  const { user } = useSelector((s) => s.userReducer);
  const wines = useGetUserWine(user.uid);
  const allWines = useGetAllWines(user.uid);
  const favWines = useGetFavoriteUserWine(user.uid);
  const [favoWines, setFavoWines] = useState([]);
  const [fav, setFav] = useState(false);
  const [myAds, setMyAds] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const clickFvt = () => {
    setFav(true);
    setMyAds(false);
  };
  const clickMyAds = () => {
    setFav(false);
    setMyAds(true);
  };
  const uniqueItems = (wines) => {
    //console.log(search);
    return wines.filter((w) => {
      let keyss = [
        "brand",
        "description",
        "locationName",
        "manufacturingYear",
        "name",
        "price",
        "wineType",
      ];
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
  useEffect(() => {
    setFavoWines([]);
    for (let i = 0; i < favWines.length; i++) {
      const obj = allWines.find((w) => w.postID === favWines[i].postID);
      setFavoWines((pre) => [...pre, obj]);
    }
    window.scrollTo(0, 0);
  }, [favWines]);
  return (
    <div>
      <UserTopbar />
      <BottomBar />
      <div className="app-container">
        <div className="my-ads">
          <div className="ads-container">
            <div className="row-tabs2">
              <div className="search-title">
                <AiOutlineSearch className="icon" />
                <input
                  type="text"
                  className="field"
                  placeholder="Cerca vino"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* <div className="status-tabs">
                <p className="navlink">All Ads</p>
                <p className="navlink">Active</p>
                <p className="navlink">InActive</p>
                <p className="navlink">Pending</p>
              </div> */}
            </div>
            <div className="row-tabs">
              <p className="tabs-l" onClick={clickMyAds}>
                Miei Post
              </p>
              <p className="tabs-r" onClick={clickFvt}>
                Vini Preferiti
              </p>
            </div>

            {wines.length > 0 && !fav && myAds && (
              <MyAdsTable
                data={uniqueItems(wines)}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            )}
            {wines.length > 5 && !fav && (
              <Pagination
                data={uniqueItems(wines)}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
              />
            )}
            {favoWines.length > 0 && fav && !myAds && (
              <FvtWineTable
                data={uniqueItems(favoWines)}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            )}
            {favoWines.length > 5 && fav && !myAds && (
              <Pagination
                data={uniqueItems(favoWines)}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdsList;
