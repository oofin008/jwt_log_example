import React, { useState, useEffect } from "react";
import Link from "next/link.js";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useForm } from "react-hook-form";

const serverUrl = "http://localhost:3001";

// set up cookies
const cookies = new Cookies();

const Index = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [token, setToken] = useState(cookies.get("token") || null);
  const [logInUser, setLogInUser] = useState()
  const [currentTime, setCurrentTime] = useState()

  const onLoginClick = async () => {
    console.log("Login called");
    const response = await axios.get(serverUrl + "/api/login");
    const token = response.data.token;
    cookies.set("token", token);
    setToken(token);
  };

  const onSubmit = async(data) => {
    console.log("Login called");
    const response = await axios.post(serverUrl + "/api/login", data);
    const {token, username, currentTime} = response.data;
    cookies.set("token", token);
    setToken(token);
    setLogInUser(username);
    setCurrentTime(currentTime);

    console.log('Log in data: ',data)
  };

  return (
    <div>
      <h2>Main page</h2>
      <br></br>
      <p>Token: {token}</p>
      <p>Log in username: {logInUser}</p>
      <p>Login Time from Server: {currentTime}</p>
      <br></br>
      <Link href="/secret">
        <a>Previous login info page</a>
      </Link>
      <br></br>
      <Link href="/regist">
        <a>Register</a>
      </Link>
      <br></br>
      <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="username" name="username" ref={register({required: true})} />
      <input type="text" placeholder="password" name="password" ref={register({required: true})} />

      <input type="submit" />
    </form>
    </div>
  );
};

export default Index;
