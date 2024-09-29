import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import BorderColorSharpIcon from '@mui/icons-material/BorderColorSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';


interface SidebarItem {
    title: string;
    icon: React.ReactElement;
    link: string;
}

const SidebarData: () => SidebarItem[] = () => [
    {
        title: 'ホーム',
        icon: <HomeIcon />,
        link: '/homePost'
    },
    {
        title: 'ユーザー',
        icon: <PersonIcon />,
        link: '/userSet'
    },
    {
        title: '投稿',
        icon: <BorderColorSharpIcon />,
        link: '/createPost'
    },
    {
        title : 'ログアウト',
        icon : <LogoutSharpIcon/>,
        link : '/signout' 
    },
];

export default SidebarData;