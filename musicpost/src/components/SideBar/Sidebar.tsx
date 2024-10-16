"use client";

import React, { useEffect, useRef, useState } from "react";
import SidebarData from "./SidebarData";
import Link from "next/link";
import "../../styles/Sidebar.css";
import { JwtPayload } from "jsonwebtoken";
import MenuIcon from '@mui/icons-material/Menu';

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
  const sideberRef = useRef<HTMLDivElement>(null);


  const [openMenu, setOpenMenu] = useState<boolean>(false);


  useEffect(() => {
    if (!openMenu) return;

    const handleOtherClick = (event: MouseEvent) => {
      //refはサイドバーのDOM要素をさしており、これがcontainsで指定した要素に入っていなかったら。つまり外側
      if (sideberRef.current && !(sideberRef.current.contains(event.target as Node))) {
        setOpenMenu(false); // サイドバー外をクリックしたら閉じる
      }
    };

    document.addEventListener('mousedown', handleOtherClick);

    return () => {
      document.removeEventListener('mousedown', handleOtherClick);
    };
  }, [openMenu]);

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  }

  return (
    <div ref={sideberRef} className={`Sidebar ${openMenu ? 'open-side' : 'close-side'}`}>
      <button onClick={handleMenu}
        className="Side-menu"
      >
        {openMenu ? '' : <MenuIcon />}
      </button>
      <ul className={`Sidebar-list ${openMenu ? 'open' : ''}`}>
        {sidebarItems.map((value: SidebarItem, index: number) => (
          <li key={index} className="row">
            <Link href={value.link}>
              <div className="Sidebar-item">
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
