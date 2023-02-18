import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { message, Spin } from "antd";
import { Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { db } from "../firebaseConfig";

const ReciepeDetails = () => {
  const params = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const [popular, setPopular] = useState([]);
  const [favRes, setFavRes] = useState(false);
  const [ingIns, setIngIns] = useState(false);
  const getReciepe = async () => {
    let response = await axios.get(
      `https://api.spoonacular.com/recipes/${params.name}/information?apiKey=${
        import.meta.env.VITE_SPOONACULAR
      }`
    );
    try {
      setPopular(response.data);
      localStorage.setItem("recipe", JSON.stringify(response.data));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getReciepe();
  }, [params.name]);

  const addFavourite = async () => {
    setFavRes(true);
    const firebaseAuth = getAuth();
    const citiesRef = collection(db, `users`);
    addDoc(collection(citiesRef, firebaseAuth?.currentUser?.uid, "favourite"), {
      image: popular.image,
      title: popular.title,
      id: popular.id,
    })
      .then((e) => {
        setFavRes(false);
        messageApi.open({
          type: "success",
          content: "Added to favorites",
        });
      })
      .catch((e) => {});
  };

  return (
    <div>
      {contextHolder}
      {popular.length === 0 ? (
        <>
          <div className="flex justify-center items-center h-96">
            <Spin size="large" />
          </div>
        </>
      ) : (
        <div className="container block sm:flex justify-center gap-5 mt-5 bg-slate-100 p-5">
          <div className="w-3/6  mx-auto text-center">
            <img
              className="rounded-2xl h-100 w-100 mx-auto"
              src={popular.image}
              alt=""
            />
            <h2 className="text-2xl">{popular.title}</h2>
          </div>
          <div className="w-3/6">
            <div className="flex items-center gap-4 mb-5">
              <button
                className={`border p-2 rounded-lg bg-indigo-${
                  ingIns ? 100 : 500
                } ${
                  !ingIns
                    ? "border border-indigo-100 text-white"
                    : "border-indigo-500 text-black"
                }`}
                onClick={() => setIngIns(!ingIns)}
              >
                Instruction
              </button>
              <button
                className={`border p-2 rounded-lg bg-indigo-${
                  !ingIns ? 100 : 500
                }  ${
                  ingIns
                    ? "border border-indigo-100 text-white"
                    : "border-indigo-500 text-black"
                }`}
                onClick={() => setIngIns(!ingIns)}
              >
                Ingredients
              </button>

              <Button
                type={"ghost"}
                className={`bg-indigo-500 flex items-center text-white ${
                  favRes ? "opacity-50" : "opacity-100"
                }`}
                size="large"
                title="Add to favourite"
                icon={favRes && <SyncOutlined spin />}
                onClick={addFavourite}
                disabled={favRes}
              >
                Add to favourite
              </Button>
            </div>
            {!ingIns ? (
              <>
                <div>
                  <p dangerouslySetInnerHTML={{ __html: popular.summary }}></p>
                  <br />
                  <p className="underline">Instruction</p>
                  <p
                    dangerouslySetInnerHTML={{ __html: popular.instructions }}
                  ></p>
                </div>
              </>
            ) : (
              <>
                <div>
                  {popular?.extendedIngredients?.map((item, i) => {
                    return <li key={i}>{item.original}</li>;
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReciepeDetails;
