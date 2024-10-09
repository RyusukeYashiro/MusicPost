import { MappedTrack } from "@/types/mappedTrack";
import { usePathname } from "next/navigation";

// 音声を停止する共通関数
export const stopAudio = (
    audioRef: React.MutableRefObject<HTMLAudioElement | null>,
    setPlayingTrackId: (id: string | null) => void
) => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = ''; // オーディオソースをクリア
        audioRef.current.load(); // オーディオを再ロード
    }
    setPlayingTrackId(null);
};

// 外部化した関数
export const handlePlayPause = (
    musicInfo: MappedTrack,
    playingTrackId: string | null,
    setPlayingTrackId: (id: string | null) => void,
    audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
    // 押されたidが現在のidと同じだったら,つまりもう一度押されたら
    if (playingTrackId === musicInfo.id) {
        stopAudio(audioRef, setPlayingTrackId);
    } else {
        stopAudio(audioRef, setPlayingTrackId); // 現在再生中のトラックがあれば停止
        // スタートの処理
        audioRef.current = new Audio(musicInfo.preview_url);
        audioRef.current.play();
        setPlayingTrackId(musicInfo.id);
        // 再生が終わった処理
        audioRef.current.onended = () => {
            setPlayingTrackId(null);
        };
    }
};

