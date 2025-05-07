import React, { useEffect, useState } from "react";
import ServerAPI from "./ServerContext";
import { deleteCookie, getCookie, setCookie } from "../utils/cookies";
const hello = "world";

const serverURL = import.meta.env.VITE_SERVER_URL;
const ServerProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [auth_token, setAuth_token] = useState(null);
  const [role, setRole] = useState(null);
  const [nodes, setNodes] = useState([
    {
      id: "leader",
      type: "leadsNode",
      position: { x: 550, y: 100 },
    },
    {
      id: "adder",
      type: "addNode",
      position: { x: 631, y: 200 },
    },
  ]);
  const [edges, setEdges] = useState([
    {
      id: "1-2",
      source: "leader",
      target: "adder",
    },
  ]);
  const [sequence, setSequence] = useState([]);
  const [leads, setLeads] = React.useState([]);
  const [sequenceName, setSequenceName] = useState("");

  useEffect(() => {
    var token = getCookie("auth_token");
    if (token) {
      setAuth_token(token);
      setUserName(getCookie("userName"));
      setRole(getCookie("role"));
    }
  }, []);

  async function signinAPI(signinData, handleOpen) {
    var result = await fetch(`${serverURL}/auth/signin`, {
      method: "POST",
      body: signinData,
    });
    result = await result.json();
    console.log(result);
    if (result.error) {
      console.log(result.error);
    } else if (result.success) {
      console.log(result.success);
      setCookie("auth_token", result.auth_token, 10);
      setCookie("userName", result.name, 10);
      setCookie("role", result.role);
      setAuth_token(result.auth_token);
      setUserName(result.name);
      setRole(result.role);
      handleOpen();
    }
  }
  async function signupAPI(signupData, handleOpen) {
    var result = await fetch(`${serverURL}/auth/signup`, {
      method: "POST",
      body: signupData,
    });
    result = await result.json();
    if (result.error) {
      console.log(result.error);
    } else if (result.success) {
      console.log(result.success);
      setCookie("auth_token", result.auth_token, 10);
      setCookie("userName", result.name, 10);
      setCookie("role", result.role);
      setAuth_token(result.auth_token);
      setUserName(result.name);
      setRole(result.role);
      handleOpen();
    }
  }

  function signOut() {
    deleteCookie("auth_token");
    deleteCookie("userName");
    deleteCookie("role");
    setAuth_token(null);
    setUserName(null);
    setRole(null);
  }

  async function fetchSequencesAPI() {
    if (!auth_token) {
      console.log("Signin Required");
      return;
    } else {
      var sequences = await fetch(`${serverURL}/mail/fetchUserSequences`, {
        method: "POST",
        headers: { authorization: auth_token },
      });
      sequences = await sequences.json();
      if (sequences.error) {
        console.log(error);
        return;
      } else if (sequences.success) {
        console.log(sequences.success);
        return sequences.sequences;
      }
    }
  }
  async function pauseSequenceAPI(sequenceId, refresher) {
    console.log(sequenceId);
    if (!auth_token) {
      console.log("please signin first!");
      return;
    }
    var body = new FormData();
    body.set("sequenceId", sequenceId);
    var result = await fetch(`${serverURL}/mail/pauseSequence`, {
      method: "POST",
      headers: { authorization: auth_token },
      body,
    });
    result = await result.json();
    if (result.error) {
      console.log(result.error);
    } else if (result.success) {
      console.log(result.success);
      refresher();
    }
  }
  async function continueSequenceAPI(sequenceId, refresher) {
    if (!auth_token) {
      console.log("please signin first!");
      return;
    }
    var body = new FormData();
    body.set("sequenceId", sequenceId);
    var result = await fetch(`${serverURL}/mail/resumeSequence`, {
      method: "POST",
      headers: { authorization: auth_token },
      body,
    });
    result = await result.json();
    if (result.error) {
      console.log(result.error);
    } else if (result.success) {
      console.log(result.success);
      refresher();
    }
  }

  async function deploySequenceAPI(sequenceData) {
    if (!auth_token) {
      console.log("You need to signin first!");
      return;
    }
    var result = await fetch(`${serverURL}/mail/addSequence`, {
      method: "POST",
      headers: { authorization: auth_token },
      body: sequenceData,
    });
    result = await result.json();
    if (result.error) {
      console.log(result.error);
      return;
    } else if (result.success) {
      console.log(result.success);
      localStorage.removeItem("sequence");
      localStorage.removeItem("leads");
      localStorage.removeItem("sequenceName");
      setSequence([]);
      setLeads([]);
      setSequenceName("");
      setEdges([
        {
          id: "1-2",
          source: "leader",
          target: "adder",
        },
      ]);
      setNodes([
        {
          id: "leader",
          type: "leadsNode",
          position: { x: 550, y: 100 },
        },
        {
          id: "adder",
          type: "addNode",
          position: { x: 631, y: 200 },
        },
      ]);
    }
  }

  return (
    <ServerAPI.Provider
      value={{
        auth_token,
        role,
        userName,
        nodes,
        setNodes,
        edges,
        setEdges,
        signinAPI,
        signupAPI,
        signOut,
        fetchSequencesAPI,
        pauseSequenceAPI,
        continueSequenceAPI,
        sequence,
        setSequence,
        leads,
        setLeads,
        sequenceName,
        setSequenceName,
        deploySequenceAPI,
      }}
    >
      {children}
    </ServerAPI.Provider>
  );
};

export default ServerProvider;
