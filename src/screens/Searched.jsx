import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spin } from "antd";
const { Meta } = Card;
import { useNavigate, useParams } from "react-router-dom";
const Searched = () => {
  const navigate = useNavigate();
  const [popular, setPopular] = useState([]);
  const params = useParams();
  const getPopular = async (name) => {
    let response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=" +
        import.meta.env.VITE_SPOONACULAR +
        "&query=" +
        name
    );
    try {
      setPopular(response.data.results);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getPopular(params.search);
  }, [params.search]);
  return (
    <div className="flex justify-center mx-auto mt-10">
      <div className="flex justify-center flex-wrap gap-5 w-11/12 sm:w-10/12">
        {popular.length === 0 ? (
          <>
            <div className="flex justify-center items-center h-96">
              <Spin size="large" />
            </div>
          </>
        ) : (
          popular.map((item, i) => {
            return (
              <Card
                key={i}
                hoverable
                className="w-5/12 sm:w-2/12"
                cover={<img alt="example" src={item?.image} />}
                onClick={() => navigate("/recipe/" + item.id)}
              >
                <Meta title={item.title} description={item.sourceName} />
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Searched;
