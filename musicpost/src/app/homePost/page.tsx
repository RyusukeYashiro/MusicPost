import React from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import HomePost from "../../components/homePost/homePost";
import { getLatestPost } from "../action";

const home = async () => {
  //初期データを取得する
  const initialPosts = await getLatestPost();

  return (
    <div className="App">
      <Sidebar />
      <HomePost initialPosts={initialPosts} />
    </div>
  );
};

export default home;
