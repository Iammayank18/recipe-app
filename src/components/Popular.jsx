import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;
const Popular = ({ populars }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mx-auto mt-10">
      <div className="flex justify-center flex-wrap gap-5 w-11/12 sm:w-10/12">
        {populars.map((item, i) => {
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
        })}
      </div>
    </div>
  );
};

export default Popular;
