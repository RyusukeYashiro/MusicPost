'use client'

import React, { useState } from 'react'
import '../styles/signUp.css';


interface ErrorType {
    [key : string] : string;
}

const signUpForm = () => {

    const [formUp , setFormUp] = useState({
        username  : '',
        password : '',
        email : '',
        confPass : '',
    });

    const [fieldError , setFieldError] = useState<ErrorType>({});

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {name , value} = e.target;
        setFormUp(prev => ({...prev , [name] : value}));
        setFieldError(prev => ({...prev , [name] : ''}));
    }

    const handleSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFieldError({});

        try {
            const response = await fetch('http://localhost:3000/signUp' , {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(formUp),
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(`Http error! status : ${response.status}`);
            }

            const data = await response.json();
            console.log('response data' , data);
            setFormUp({
                username  : '',
                password : '',
                email : '',
                confPass : '',
            });
        } catch (error : unknown) {
            if(error instanceof Error) {
                console.error('error signUp' , error.message); 
                setFieldError({message : error.message});
            } else {
                console.error('unknown error' , error);
            }
        }
    }

    return (
        <div className='signUp'>
            <div className='form-contents'>
                <form name='form-signUp' onSubmit={handleSubmit}>
                    <div className='app-user'>
                        <input required type='text'
                        placeholder='ユーザー名'
                        value={formUp.username}
                        name='username'
                        onChange={handleChange}>
                        </input>
                        {fieldError.username && (
                            <div className='error-msg' style={{color : 'red'}}>
                                {fieldError.username}
                            </div>
                        )}
                        <input required type='text'
                        placeholder='emailを登録してください'
                        value={formUp.email}
                        name='email'
                        onChange={handleChange}></input>
                        {fieldError.email && (
                            <div className='error-msg' style={{color : 'red'}}>
                                {fieldError.email}
                            </div>
                        )}
                        <input required type='password'
                        placeholder='パスワード(8文字以上)'
                        value={formUp.password}
                        name='password'
                        onChange={handleChange}></input>
                        {fieldError.password && (
                            <div className='error-msg' style={{color : 'red'}}>
                                {fieldError.password}
                            </div>
                        )}
                        <input required type='password'
                        placeholder='もう一度パスを確認してください'
                        value={formUp.confPass}
                        name='confPass'
                        onChange={handleChange}></input>
                        {fieldError.confPass && (
                            <div className='error-msg' style={{color : 'red'}}>
                                {fieldError.confPass}
                            </div>
                        )}
                    </div>
                    <button type='submit'>submit</button>
                </form>
            </div>
        </div>
    )
}

export default signUpForm