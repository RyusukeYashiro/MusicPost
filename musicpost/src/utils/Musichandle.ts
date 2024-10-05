import { MappedTrack } from "@/types/mappedTrack";

// 外部化した関数
export const handlePlayPause = (
    musicInfo: MappedTrack,
    playingTrackId: string | null,
    setPlayingTrackId: (id: string | null) => void,
    audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
    // 押されたidが現在のidと同じだったら,つまりもう一度押されたら
    if (playingTrackId === musicInfo.id) {
        // stopさせて
        audioRef?.current?.pause();
        // track-idをnullにセット
        setPlayingTrackId(null);
    } else {
        if (playingTrackId) {
            audioRef?.current?.pause();
        }
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
