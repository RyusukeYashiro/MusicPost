'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';

const userSet = () => {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    }

    useEffect(() => {
        Modal.setAppElement(".modalMain");
        console.log("this is modal deal");
    }, []);

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

                </div>
            </Modal>
        </div>
    )
}

export default userSet;