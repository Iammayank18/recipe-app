import React, { useEffect, useState } from "react";
import { Avatar, Popover, Modal } from "antd";
import { UserOutlined, UnlockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebaseConfig";
import { useDispatch } from "react-redux";
import { authUser } from "../redux/action";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [chats, setChats] = useState([]);
  const firebaseAuth = getAuth();
  let userStorage = JSON.parse(localStorage.getItem("user"));
  const UID = firebaseAuth?.currentUser?.uid ?? userStorage.id;
  useEffect(() => {
    const citiesRef = collection(db, `users`);
    const unsub = onSnapshot(
      query(collection(citiesRef, UID, "favourite")),
      (doc) => {
        setChats(
          doc?.docs?.map((item) => ({
            image: item?.data()?.image,
            id: item?.data()?.id,
            title: item?.data()?.title,
            itemid: item?.id,
          }))
        );
      }
    );
    return unsub;
  }, []);

  const signOutUser = () => {
    signOut(firebaseAuth)
      .then((e) => {
        console.log(e);
        dispatch(
          authUser({
            isLoggedin: false,
            email: "",
          })
        );
        localStorage.setItem("user", "");
        navigate("/");
      })
      .catch((error) => {});
  };

  const content = () => {
    return (
      <>
        <p
          onClick={() => setIsAccountModalOpen(true)}
          className="hover:bg-slate-100 p-1 px-2 rounded-lg cursor-pointer"
        >
          Account
        </p>
        <p
          onClick={() => setIsModalOpen(true)}
          className="hover:bg-slate-100 p-1 px-2 rounded-lg cursor-pointer"
        >
          Favourites
        </p>
        <p
          onClick={signOutUser}
          className="hover:bg-slate-100 p-1 px-2 rounded-lg cursor-pointer"
        >
          Logout
        </p>
      </>
    );
  };

  const deleteDocs = async (id) => {
    const userRef = collection(db, "users");
    const favRef = collection(userRef, `${UID}/favourite`);
    const favId = doc(favRef, id);
    await deleteDoc(favId);
  };

  return (
    <div className="container mx-auto flex justify-between items-center p-2 m-2  rounded ">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <h2 className="logo">RecipeHub</h2>
      </div>
      <div>
        <Popover content={content}>
          <Avatar
            className="cursor-pointer flex justify-center items-center "
            style={{
              backgroundColor: "#87d068",
            }}
            icon={<UserOutlined />}
          />
        </Popover>
      </div>

      <Modal
        title="Favourites"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer
        className="favourite-modal"
      >
        {chats.length == 0 ? (
          <>
            <div className="flex justify-center items-center">
              <h2>There is no data</h2>
            </div>
          </>
        ) : (
          chats.map((item, i) => {
            return (
              <div key={i} className="flex m-2 shadow-lg gap-2 rounded-lg ">
                <img
                  src={item.image}
                  alt=""
                  className="rounded cursor-pointer"
                  style={{
                    width: "100px",
                  }}
                  onClick={() => navigate("/recipe/" + item.id)}
                />
                <div className="flex flex-col justify-evenly ">
                  <h2>{item.title}</h2>
                  <p
                    className="text-xs text-sky-800 cursor-pointer"
                    onClick={() => deleteDocs(item.itemid)}
                  >
                    Remove from favourite
                  </p>
                </div>
              </div>
            );
          })
        )}
      </Modal>

      <Modal
        style={{
          height: "100px",
        }}
        title="My Account"
        footer
        open={isAccountModalOpen}
        onCancel={() => setIsAccountModalOpen(false)}
      >
        <div className="flex justify-center items-center ">
          <div className="text-center">
            <Avatar
              size="large"
              className="flex justify-center items-center mx-auto"
              icon={<UserOutlined />}
            />
            <h2>
              {firebaseAuth.currentUser?.displayName ?? userStorage.username}
            </h2>
            <h2 className="flex gap-2 justify-center items-center">
              <MailOutlined />
              {firebaseAuth.currentUser?.email ?? userStorage.email}
            </h2>
            <h2 className="flex gap-2 justify-center items-center">
              <UnlockOutlined />
              {firebaseAuth.currentUser?.password ?? userStorage.password}
            </h2>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NavBar;
