import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import { handleAuthSSR } from "../utils/auth";
import useRouter from 'next/router'

const serverUrl = "http://localhost:3001";

// set up cookies
const cookies = new Cookies();

const Secret = (props) => {
  const token = cookies.get("token");
  const [tableData, settableData] = useState([]);

  const router = useRouter

  const getLogInData = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/logindata", {
        headers: { Authorization: token },
      });
      console.log("success : ", result.data);
      settableData(result.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  //Run get Data first time render
  useEffect(()=>{
    getLogInData()
  },[])

  const renderTable = (data) => {
    if(data !== undefined){
      let return_data = data.map((element) => {
        return (
          <tr>
            <td>{element.message.username}</td>
            <td>{element.message.password}</td>
            <td>{element.message.function}</td>
          </tr>
        );
      });
      return return_data;
    }else{
      return (null)
    }
  };

  return (
    <div>
      <h2>Login information</h2>
      <p>Only accessible via a valid JWT</p>
      <br></br>
      <button onClick={()=>{router.back()}}>Go Back</button>
      <p>Previous login information</p>
      <table>
        <thead>
          <tr>
            <td>User</td>
            <td>Password</td>
            <td>Function</td>
          </tr>
        </thead>
        <tbody>{renderTable(tableData)}</tbody>
      </table>
    </div>
  );
};

// Server-Side Rendering
Secret.getInitialProps = async (ctx) => {
  // Must validate JWT
  // If the JWT is invalid it must redirect
  // back to the main page. You can do that
  // with Router from 'next/router
  await handleAuthSSR(ctx);

  // Must return an object
  return {};
};

export default Secret;
