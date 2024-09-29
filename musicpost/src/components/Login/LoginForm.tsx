'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorType } from '../SignUp/SignUpForm';
import '../../styles/login.css';



const LoginForm = () => {

  const router = useRouter();

  const [formIn , setFormIn] = useState({
    username : '',
    password : ''
  });

  const [fieldError , setFieldError] = useState<ErrorType>({})

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const {name , value} = e.target;
    setFormIn(prev => ({...prev , [name] : value}));
    setFieldError(prev => ({...prev , [name] : ''}));
  }

  const handleSubmit = async (e : React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setFieldError({});

    try {
      const response = await fetch('http://localhost:3000/api/login' , {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(formIn),
      });

      console.log("response!!!!" , response);

      if(!response.ok){
        const errorData = await response.json();
        if(errorData.error === 'ユーザー名かパスワードが正しくありません'){
          setFieldError({username : errorData.error});
          setFieldError({password : errorData.error});
        } 
      } else {
        console.log("success!");
        router.push('/homePost');
      }
      
    } catch (err : unknown) {
      if(err instanceof Error){
        console.error('error signUp' , err.message);
        setFieldError({message : err.message});
      } else {
        console.error('unknown error' , err);
      }
    }
  }

  return (
    <div className='login'>
      <div className='form-contents'>
        <form name='form-login' onSubmit={handleSubmit} action='/login' autoComplete='off'>
          <div className='app-user'>
            <input required type='text'
            placeholder='ユーザー名'
            name='username'
            value={formIn.username}
            onChange={handleChange}>
            </input>
            {fieldError.username && (
              <div className='error-msg' style={{color : 'red'}}>
                {fieldError.username}
              </div>
            )}
            <input required type='password'
            placeholder='パスワードを入力してください'
            name='password'
            value={formIn.password}
            onChange={handleChange}>
            </input>
            {fieldError.password && (
              <div className='error-msg' style={{color : 'red'}}>
                {fieldError.password}
              </div>
            )}
          </div>
          <button type='submit'>ログイン</button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm