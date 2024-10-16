import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import BorderColorSharpIcon from "@mui/icons-material/BorderColorSharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { JwtPayload } from "jsonwebtoken";

interface SidebarItem {
  title: string;
  icon: React.ReactElement;
  link: string;
}

type UserInfo = string | JwtPayload | null | undefined;

//ダイナミックルーティングを使用
const SidebarData = (name: UserInfo): SidebarItem[] => {
  const userLink = (() => {
    if (!name) {
      return '/login';
    }
    const username = typeof name === 'string' ? name : name.username;
    return username ? `/userSet/${encodeURIComponent(username)}` : '/login';
  })();

  return [
    {
      title: "ホーム",
      icon: <HomeIcon />,
      link: "/homePost",
    },
    {
      title: "ユーザー",
      icon: <PersonIcon />,
      link: userLink,
    },
    {
      title: "投稿",
      icon: <BorderColorSharpIcon />,
      link: "/createPost",
    },
    {
      title: "ログアウト",
      icon: <LogoutSharpIcon />,
      link: "/logOut",
    },
  ];
};

export default SidebarData;
