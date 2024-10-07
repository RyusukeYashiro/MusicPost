'use client';

import React, { useEffect, useRef, useState } from "react";
import { getLatestPost } from "@/app/action";
import { MappedTrack } from "@/types/mappedTrack";
import { handlePlayPause } from "@/utils/Musichandle";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Image from "next/image";
import noimage from "../../../public/images/3.png";
import { usePathname } from "next/navigation";
import '../../styles/HomePost.css';
import PersonIcon from '@mui/icons-material/Person';

export interface Post {
    user_id: number;
    user_name: string;
    music_id: string;
    content: string;
}

interface PostData {
    posts: Post[];
    musicInfo: MappedTrack[];
}

interface HomePostProps {
    initialPosts: PostData;
}

const HomePost: React.FC<HomePostProps> = ({ initialPosts }) => {
    const [allPost, setPosts] = useState<PostData>(initialPosts);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pathname = usePathname();

    const refreshPost = async () => {
        const latestPosts = await getLatestPost();
        setPosts(latestPosts);
        console.log('latestPost', latestPosts);
    }


    useEffect(() => {
        if (pathname === '/homePost') {
            refreshPost();
        }
    }, [pathname]);
    return (
        <div className="post">
            <ul className="post-list">
                {allPost.posts.map((post) => {
                    const music = allPost.musicInfo.find((m) => m.id === post.music_id);
                    if (!music) return null;
                    return (
                        <li key={`${post.user_id}-${music.id}`}>
                            <div className="post-item">
                                <div>
                                    <PersonIcon />
                                    {post.user_name}
                                </div>
                                <div className="post-music">
                                    <div className="music-select">
                                        <Image
                                            alt={`Album art for ${music.name}`}
                                            src={music.albumArt || noimage}
                                            width={80}
                                            height={80}
                                            className="rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">
                                            <a
                                                href={music.musicUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {music.name}
                                            </a>
                                        </h3>
                                        <p className="text-gray-600">
                                            <a
                                                href={music.artistUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
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
                                <div className="post-content">
                                    <div>{post.content}</div>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <audio ref={audioRef} />
        </div>
    );
};

export default HomePost;