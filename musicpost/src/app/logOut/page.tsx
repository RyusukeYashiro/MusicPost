'use client'

import Modal from 'react-modal'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { logOutUser } from '../action';
import '../../styles/logOut.css';

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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    content: {
                        position: 'relative',
                        top: 'auto',
                        left: 'auto',
                        right: 'auto',
                        bottom: 'auto',
                        borderRadius: 20,
                        padding: 20,
                        maxHeight: '200px',
                        maxWidth: '450px',
                        width: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <div className='delete-message'>
                    <h2>このアカウントからログアウトしますか?</h2>
                    <div className='logOut-footer'>
                        <button onClick={handleLogOut} className='log-out-btn'>
                            <div className='logout'>
                                ログアウト
                            </div>
                        </button>
                        <button onClick={handleClose} className='log-out-cancel'>
                            <div className='logout-not'>キャンセル</div>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default logOut;