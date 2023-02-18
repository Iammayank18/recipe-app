import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, Register, ReciepeDetails, Login, Searched } from "./screens";
import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { authUser } from "./redux/action";
const Router = () => {
  const authData = useSelector((data) => data.MainReducer.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("user") != "") {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        dispatch(
          authUser({
            isLoggedin: user?.isLoggedin,
            email: user?.email,
          })
        );
      }
    }
  }, [dispatch]);
  return (
    <div className="container mx-auto">
      <BrowserRouter>
        {authData ? (
          <>
            <NavBar />
            <SearchBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:name" element={<ReciepeDetails />} />
              <Route path="/search/:search" element={<Searched />} />
            </Routes>
          </>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </>
        )}
      </BrowserRouter>
    </div>
  );
};

export default Router;
