"use client";

import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../styles/PostModal.css";
import Image from "next/image";
import Loading from "@/app/loading";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { SpotifyApiTrack } from "../../types/spotifyApiTrack";
import { MappedTrack } from "../../types/mappedTrack";
import { stopAudio, handlePlayPause } from "../../utils/MusicHandle";

const PostModal: React.FC = () => {

    const router = useRouter();

    useEffect(() => {
        Modal.setAppElement(".modalMain");
        setSelectImg("");
        audioRef.current = new Audio();
        return () => {
            console.log('これはアンマウント時の処理');
            stopAudio(audioRef, setPlayingTrackId);
        }
    }, []);

    const [searchMusic, setSearchMusic] = useState("");
    const [result, setResult] = useState<MappedTrack[]>([]);
    const [comment, setComment] = useState("");
    const [selectMusic, setSelectMusic] = useState<MappedTrack | null>(null);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [selectImg, setSelectImg] = useState<string>("");

    //プレビュー再生処理
    const audioRef = useRef<HTMLAudioElement | null>(null);
    //モーダルが閉じる時の処理
    const handleClose = () => {
        router.back();
    };

    //スクロール処理とcheck-boxをつける処理
    const ref = useRef<HTMLDivElement | null>(null);
    const startRef = useRef<HTMLFormElement | null>(null);

    const scroll = (props: React.RefObject<HTMLElement>) => {
        if (props.current) {
            props.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSelect = (track: MappedTrack) => {
        //もし現在のidと選んだidが同じだったら
        if (selectMusic && selectMusic.id === track.id) {
            setSelectMusic(null);
        } else {
            setSelectImg(track.albumArt);
            setSelectMusic(track);
            // 時間差でスクロール処理を呼び出している
            setTimeout(() => scroll(ref), 100);
        }
    };

    const cancelSelect = () => {
        setSelectMusic(null);
        scroll(startRef);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        audioRef?.current?.pause();
        setSelectMusic(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spotify/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: searchMusic }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            //response情報が載っている。
            //これをstateに入れて、後でlistとして展開する。
            //今回欲しい（操作したいjson)
            const tracks: MappedTrack[] = data.tracks.items.map((item: SpotifyApiTrack) => ({
                id: item.id,
                name: item.name,
                albumArt: item.album?.images[0]?.url || "/placeholder-album-art.png",
                musicUrl: item.external_urls?.spotify ?? "#",
                artist: item.artists?.[0]?.name ?? "Unknown Artists",
                artistUrl: item.artists?.[0]?.external_urls?.spotify ?? "#",
                preview_url: item.preview_url,
            }));

            console.log(tracks);
            setResult(tracks);
        } catch (err) {
            console.error("error api call", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (!selectMusic || !comment.trim()) {
            alert("音楽と感想を入力してください。");
        }
        //dbに保存する処理。ユーザーと紐付ける必要がある。
        //つまりユーザーのログイン情報を使う。
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/PostMusic`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ms: selectMusic, postContent: comment }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '不明なエラーが発生しました');
            }

            const data = await response.json();
            console.log("success! create post", data);
            setSelectMusic(null);
            setSearchMusic("");
            setComment("");
            router.push("/homePost");
        } catch (err) {
            console.error("error api call", err);
        }
    };

    return (
        <div className="modalMain">
            <Modal
                isOpen={true}
                onRequestClose={handleClose}
                contentLabel="Create Post Modal"
                //shouldCloseOnOverlayClick={false}
                style={{
                    overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        backgroundColor: "rgb(191 188 188 / 75%)",
                    },
                    content: {
                        borderRadius: 20,
                        overflowY: "auto",
                        padding: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // maxHeight: '190vh',
                    },
                }}
            >
                <div className="title-search-wrapper">
                    <form className="search-form" onSubmit={handleSearch} ref={startRef}>
                        <input type="text" placeholder="キーワードを入力" onChange={(e) => setSearchMusic(e.target.value)} />
                        <button type="submit" aria-label="検索" className="search-btn"></button>
                    </form>

                    <Suspense fallback={<Loading />}>
                        <ul className="music-list">
                            {result.map((track) => (
                                <li key={track.id} className="music-item">
                                    <div className="music-select" onClick={() => handleSelect(track)}>
                                        <input
                                            type="checkbox"
                                            checked={selectMusic?.id === track.id}
                                            onChange={() => handleSelect(track)}
                                        ></input>
                                        <Image alt="package img" src={track.albumArt} width={80} height={80} className="rounded-md"></Image>
                                    </div>
                                    <h3 className="font-bold font-size: 0.875rem; ml-4 mr-4">
                                        <a
                                            href={track.musicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[#1abc54] transition-colors duration-300"
                                        >
                                            {track.name}
                                        </a>
                                    </h3>
                                    <p>
                                        <a
                                            href={track.artistUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[#1abc54] transition-colors duration-300"
                                        >
                                            {track.artist}
                                        </a>
                                    </p>
                                    {track.preview_url && (
                                        <button
                                            className="music-play-pause"
                                            onClick={() => {
                                                handlePlayPause(track, playingTrackId, setPlayingTrackId, audioRef);
                                            }}
                                        >
                                            {playingTrackId === track.id ? (
                                                <PauseCircleOutlineIcon className="mx-4" sx={{ fontSize: 40 }} />
                                            ) : (
                                                <PlayCircleOutlineIcon className="mx-4" sx={{ fontSize: 40 }} />
                                            )}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Suspense>
                </div>

                {selectMusic && (
                    <div className="mt-4" ref={ref}>
                        <h4>選択された曲 : </h4>
                        <p>
                            {selectMusic.name} - {selectMusic.artist}
                        </p>
                        <Image alt="package img" src={selectImg} width={220} height={200} className="rounded-md"></Image>
                        <button className="cancel-select" onClick={() => cancelSelect()}>
                            選択解除
                        </button>
                    </div>
                )}

                <form className="post-form" onSubmit={handleSubmit}>
                    <div className="post-comment">
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="おすすめ、コメントを曲と共に投稿しよう！"
                            className="comment-text"
                        ></textarea>
                    </div>
                    <div className="footer">
                        <button type="submit" className="post-sub">
                            投稿する
                        </button>
                        <button type="button" className="post-close" onClick={handleClose}>
                            キャンセル
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
export default PostModal;
