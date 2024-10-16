import React from "react";
import Sidebar from "../../components/sideBar/Sidebar";
import HomePost from "../../components/homePost/homePost";
import { getLatestPost, getUserInfo } from "../action";

const home = async () => {
  //初期データを取得する
  const initialPosts = await getLatestPost();
  //ここで初期username , user-idを取得しておく
  const username = await getUserInfo();
  console.log('this is username in home', username);

  return (
    <div className="App">
      <Sidebar username={username} />
      <HomePost initialPosts={initialPosts} />
    </div>

  );
};

export default home;
