'use client';

import { deltePost, getUserData } from '@/app/action';
import { MappedTrack } from '@/types/mappedTrack';
import { Post } from '@/types/serverType';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal';
import noimage from "../../../../public/images/3.png";
import { handlePlayPause, stopAudio } from '@/utils/Musichandle';
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import '../../../styles/UserSet.css';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';

interface PostData {
    posts: Post[];
    musicInfo: MappedTrack[];
}

export interface PostContent {
    content: string;
    id: number;
}

const userSet = () => {
    const [UserAllPost, setUserAllPost] = useState<PostData>({
        posts: [], // 空の配列を初期値に設定
        musicInfo: [], // 空の配列を初期値に設定
    });

    const [PostCount, setPostCount] = useState(0);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [selectContent, setSelectContent] = useState<PostContent | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const router = useRouter();
    const pathName = usePathname();
    const handleClose = () => {
        router.back();
    }

    const pathname = usePathname();

    const handleSelect = (postContent: PostContent) => {
        if (selectContent && selectContent.content === postContent.content) {
            setSelectContent(null);
        } else {
            setSelectContent(postContent);
            console.log('選んだポスト情報', postContent);
        }
    }

    useEffect(() => {
        Modal.setAppElement(".modalMain");
        console.log("これは初期マウント時の処理になります");
        audioRef.current = new Audio();
        return () => {
            console.log('これはアンマウント時の処理になります', audioRef);
            stopAudio(audioRef, setPlayingTrackId);
        };
    }, []);

    //パラメーターから名前を取得
    let holdName = '';
    for (let i = pathName.length - 1; i >= 0; i--) {
        if (pathName[i] === '/') {
            break;
        }
        holdName = pathName[i] + holdName;
    }

    useEffect(() => {
        const fetchData = async () => {
            if (holdName) {
                try {
                    const UserData = await getUserData(holdName);
                    setUserAllPost({
                        posts: UserData.UserPosts, // UserPostsのデータを設定
                        musicInfo: UserData.musicInfo // musicInfoのデータを設定
                    });
                    setPostCount(UserData.UserPosts.length); // 投稿数を設定
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        };

        fetchData();
    }, [holdName]);

    const handleDelete = async () => {
        const result = await deltePost(selectContent);
        if (result) {
            //ここで状態変数をリロードを挟まずに削除する
            setUserAllPost((prevPost) => ({
                ...prevPost,
                posts: prevPost.posts.filter((post) => post.id !== selectContent?.id)
            }));
            setPostCount((prevCount) => (prevCount - 1));
            setSelectContent(null);
            console.log('削除成功です');
        }
    }


    return (
        <div className='modalMain' >
            <Modal
                isOpen={true}
                onRequestClose={handleClose}
                contentLabel='profile info'
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        backgroundColor: "rgb(191 188 188 / 75%)",
                    },
                    content: {
                        borderRadius: 20,
                        overflowY: "auto",
                        padding: 30,
                        display: 'flex',
                        alignItems: 'center',
                    },
                }
                }>
                <div className='user-container' >
                    <div className='user-info' >
                        <div>ユーザー情報 : </div>
                        <PersonIcon></PersonIcon>
                        < div className='user-name' > {holdName} </div>
                    </div>
                    < div className='user-prof' >
                        <div>
                            投稿数 : {PostCount}
                        </div>
                        {selectContent && (
                            <div className='delete-btn'>
                                <DeleteIcon></DeleteIcon>
                                <button onClick={handleDelete}>
                                    <div>削除</div>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='user-post'>
                        <ul className='user-post-list' >
                            {UserAllPost?.posts?.map((post) => {
                                const music = UserAllPost.musicInfo.find((m) => m.id === post.music_id);
                                if (!music) return null;
                                return (
                                    <li
                                        key={`${post.user_id}-${music.id}`}
                                    >
                                        <div className='user-item' >
                                            <div className='post-select'
                                                onClick={() => handleSelect({ content: post.content, id: post.id })}
                                            >
                                                <input
                                                    type='checkbox'
                                                    checked={selectContent?.content === post.content}
                                                    onChange={() => handleSelect({ content: post.content, id: post.id })}
                                                ></input>
                                                <Image
                                                    alt={`Album art for ${music.albumArt}`}
                                                    src={music.albumArt || noimage}
                                                    width={80}
                                                    height={80}
                                                    className='rounded-md'
                                                ></Image>
                                            </div>
                                            < div >
                                                <h3 className='font-bold' >
                                                    <a
                                                        href={music.musicUrl}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                    >
                                                        {music.name}
                                                    </a>
                                                </h3>
                                                < p className='text-gray-600' >
                                                    <a
                                                        href={music.artistUrl}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                    >
                                                        {music.artist}
                                                    </a>
                                                </p>
                                            </div>
                                            {
                                                music.preview_url && (
                                                    <button
                                                        className="music-play-pause"
                                                        onClick={() => handlePlayPause(music, playingTrackId, setPlayingTrackId, audioRef)
                                                        }
                                                    >
                                                        {playingTrackId === music.id ? (
                                                            <PauseCircleOutlineIcon />
                                                        ) : (
                                                            <PlayCircleOutlineIcon />
                                                        )}
                                                    </button>
                                                )}
                                        </div>
                                        < div className='user-content' >
                                            <div>{post.content} </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default userSet;