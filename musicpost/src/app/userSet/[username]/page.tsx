'use client';

import { getUserData } from '@/app/action';
import { MappedTrack } from '@/types/mappedTrack';
import { Post } from '@/types/serverType';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal';
import noimage from "../../../../public/images/3.png";
import { handlePlayPause } from '@/utils/Musichandle';
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

interface PostData {
    posts: Post[];
    musicInfo: MappedTrack[];
}

const userSet = () => {
    const [UserAllPost, setUserAllPost] = useState<PostData>({
        posts: [], // 空の配列を初期値に設定
        musicInfo: [], // 空の配列を初期値に設定
    });

    const [PostCount, setPostCount] = useState(0);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const router = useRouter();
    const pathName = usePathname();
    const handleClose = () => {
        router.back();
    }

    useEffect(() => {
        Modal.setAppElement(".modalMain");
        console.log("this is modal deal");
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

    return (
        <div className='modalMain'>
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
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    },
                }}>
                <div className='profile-info'>
                    <div>ユーザー情報</div>
                    <div className='user-prof'>
                        <div>
                            投稿数 : {PostCount}
                        </div>
                    </div>
                    <div className='user-post'>
                        <ul className='user-post-list'>
                            {UserAllPost?.posts?.map((post) => {
                                const music = UserAllPost.musicInfo.find((m) => m.id === post.music_id);
                                if (!music) return null;
                                return (
                                    <li key={`${post.user_id}-${music.id}`}>
                                        <div className='user-item'>
                                            <div className='post-select'>
                                                <input
                                                    type='checkbox'
                                                ></input>
                                                <Image
                                                    alt={`Album art for ${music.albumArt}`}
                                                    src={music.albumArt || noimage}
                                                    width={80}
                                                    height={80}
                                                    className='rounded-md'
                                                ></Image>
                                            </div>
                                            <div>
                                                <h3 className='font-bold'>
                                                    <a
                                                        href={music.musicUrl}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                    >
                                                        {music.name}
                                                    </a>
                                                </h3>
                                                <p className='text-gray-600'>
                                                    <a
                                                        href={music.artistUrl}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                    >
                                                        {music.artist}
                                                    </a>
                                                </p>
                                            </div>
                                            {music.preview_url && (
                                                <button
                                                    className="music-play-pause"
                                                    onClick={() => handlePlayPause(music, playingTrackId, setPlayingTrackId, audioRef)}
                                                >
                                                    {playingTrackId === music.id ? (
                                                        <PauseCircleOutlineIcon />
                                                    ) : (
                                                        <PlayCircleOutlineIcon />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <div className='user-content'>
                                            <div>{post.content}</div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <audio ref={audioRef} />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default userSet;