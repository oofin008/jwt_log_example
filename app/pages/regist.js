import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link.js";
import Router from "next/router";

const serverUrl = "http://localhost:3001";

const Regist = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [registStatus, setRegistStatus] = useState(false);

  useEffect(() => {
    if (registStatus === true) {
        Router.replace('/index')
    }
  }, [registStatus]);

  const onSubmit = async (data) => {
    console.log("Regist data: ", data);
    const result = await axios.post(serverUrl + "/api/register", data);
    console.log("Regist result: ", result.status);
    alert("Register success! redirecting to index");
    setRegistStatus(true);
  };

  return (
    <div>
      <Link href="/index">
        <a>Back to Index</a>
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>User name</label>
        <input
          ref={register}
          name="username"
          type="text"
          placeholder="username"
        />
        <label>Password</label>
        <input
          ref={register}
          name="password"
          type="password"
          placeholder="password"
        />
        <button type="submit" name="submit">
          Submit
        </button>
        <button type="reset" name="submit">
          Reset
        </button>
      </form>
    </div>
  );
};

export default Regist;
