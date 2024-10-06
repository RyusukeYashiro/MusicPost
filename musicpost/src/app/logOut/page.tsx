'use client'

import Modal from 'react-modal'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { logOutUser } from '../action';

const logOut = () => {

    useEffect(() => {
        Modal.setAppElement(".modalMain");
        console.log('this is modal deal');
    }, []);

    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    const handleLogOut = async () => {
        try {
            const result = logOutUser();
            console.log("this is result", result);
            if (result) {
                router.push('/');
            }
        } catch (err) {
            console.error("this is error");
            alert('ログアウト中に予期せぬエラーが発生しました');
        }
    }

    return (
        <div className='modalMain'>
            <Modal
                isOpen={true}
                onRequestClose={handleClose}
                contentLabel='Create Post Modal'
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        backgroundColor: "rgb(191 188 188 / 75%)",
                    },
                    content: {
                        borderRadius: 20,
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    },
                }}
            >
                <div className='delete message'>
                    <h2>このアカウントからログアウトしますか?</h2>
                    <button onClick={handleLogOut}>ログアウト</button>
                    <button onClick={handleClose}>キャンセル</button>
                </div>
            </Modal>
        </div>
    )
}

export default logOut;