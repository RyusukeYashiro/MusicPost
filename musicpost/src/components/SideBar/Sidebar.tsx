"use client";

import React from "react";
import SidebarData from "../SideBar/SidebarData";
import Link from "next/link";
import "../../styles/Sidebar.css";
import { JwtPayload } from "jsonwebtoken";

interface SidebarItem {
  title: string;
  icon: React.ReactElement;
  link: string;
}
type SidebarProps = {
  username: string | JwtPayload | undefined;
}

const Sidebar = (username: SidebarProps) => {
  // SidebarData を関数として呼び出し、結果を配列として使用
  console.log("this is username in Sidebar", username);
  const sidebarItems = SidebarData(username.username);
  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {sidebarItems.map((value: SidebarItem, index: number) => (
          <li key={index} className="row">
            <Link href={value.link}>
              <div className="sidebarItem">
                <div id="icon">{value.icon}</div>
                <div id="title">{value.title}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
