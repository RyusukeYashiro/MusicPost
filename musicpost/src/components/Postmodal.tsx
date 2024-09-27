'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/Postmodal.css'

const PostModal: React.FC = () => {

    const router = useRouter();

    const handleClose = () => {
        router.back();
    }

  return (
    <Modal
        isOpen={true}
        onRequestClose={handleClose}
        contentLabel="Create Post Modal"
    //   shouldCloseOnOverlayClick={false}
        style={{
            overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "rgb(191 188 188 / 75%)",
            },
            content: {
                borderRadius : 20,
                overflowY: 'auto',
                padding : 20,
                display : 'flex',
                flexDirection : 'column',
                alignItems : 'center'
                // maxHeight: '190vh',
            },
        }}
    >
        <div className="title-search-wrapper">
            <form action="#" className="search-form">
                <label>
                    <input type="text" placeholder="曲を検索"/>
                </label>
                <button type="submit" aria-label="検索"></button>
            </form>
        </div>
        <form className="post-form">
            <div className="post-comment">
                <textarea id="comment" placeholder="おすすめ、コメントを曲と共に投稿しよう！" className="comment-text"></textarea>
            </div>
            <div className='footer'>
                <button type="button" className="post-sub">投稿する</button>
                <button type="button" className="post-close" onClick={handleClose}>キャンセル</button>
            </div>
        </form>
    </Modal>
  );
};

export default PostModal;
