import React, { useEffect, useState } from "react";

import axios from "axios";
import Popular from "../components/Popular";
const Home = () => {
  const [popular, setPopular] = useState([]);
  useEffect(() => {
    getPopular();
  }, []);
  const getPopular = async () => {
    let popularFromStorage = JSON.parse(localStorage.getItem("popular"));
    if (popularFromStorage) {
      setPopular(popularFromStorage);
    } else {
      let response = await axios.get(
        "https://api.spoonacular.com/recipes/random?apiKey=" +
          import.meta.env.VITE_SPOONACULAR +
          "&number=9"
      );
      try {
        setPopular(response.data.recipes);
        localStorage.setItem("popular", JSON.stringify(response.data.recipes));
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div>
      <Popular populars={popular} />
    </div>
  );
};

export default Home;
