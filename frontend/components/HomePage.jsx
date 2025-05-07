import React, { useContext, useEffect, useState } from "react";
import ServerAPI from "../context/ServerContext";
import { Link } from "react-router-dom";
import { GrAdd } from "react-icons/gr";

const HomePage = () => {
  const {
    auth_token,
    fetchSequencesAPI,
    pauseSequenceAPI,
    continueSequenceAPI,
  } = useContext(ServerAPI);
  const [sequences, setSequences] = useState([]);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    async function func() {
      setSequences(await fetchSequencesAPI());
    }
    func();
  }, [auth_token, toggle]);
  function refresher() {
    setToggle(!toggle);
  }
  function pauseHandler(sequenceId) {
    const confirmation = confirm("Do you really want to pause this sequence?");
    if (!confirmation) {
      return;
    } else {
      pauseSequenceAPI(sequenceId, refresher);
    }
  }
  function continueHandler(sequenceId) {
    const confirmation = confirm(
      "Do you really want to continue this sequence?"
    );
    if (!confirmation) {
      return;
    } else {
      continueSequenceAPI(sequenceId, refresher);
    }
  }

  return !auth_token ? (
    <h1
      className="w-full grid place-items-center text-lg"
      style={{ height: "20rem", fontSize: "2rem", color: "red" }}
    >
      Please Signin to access more features of the website :)
    </h1>
  ) : (
    <>
      <div
        className="flex flex-col justify-between items-center"
        style={{ padding: "5% 15%" }}
      >
        <div className="w-full flex justify-between items-center">
          <h1
            className="w-full grid place-items-start text-lg"
            style={{ fontSize: "2rem" }}
          >
            Your Sequences:
          </h1>
          <Link
            to="/new_sequence"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 border border-gray-400 rounded shadow flex items-center justify-center"
            style={{
              width: "13rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              gap: "4px",
            }}
          >
            <GrAdd />
            New Sequence
          </Link>
        </div>
        <div
          className=" flex justify-between items-center flex-col"
          style={{
            width: "70%",
            paddingTop: "2rem",
            gap: "1rem",
          }}
        >
          {!sequences || !sequences.length ? (
            <div
              style={{ fontSize: "1.3rem", marginTop: "2rem", color: "red" }}
            >
              No Sequences Created Yet!
            </div>
          ) : (
            sequences?.map((seq, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex justify-between items-center"
                  style={{
                    heigth: "5rem",
                    gap: "1rem",
                    border: "1px solid gray",
                    padding: "1rem",
                    borderRadius: "10px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      color: seq.active ? "green" : "red",
                      fontWeight: "900",
                    }}
                  >
                    {`${index + 1}. ${seq.sequenceName}`}
                  </h2>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      color: seq.active ? "green" : "red",
                      // fontWeight: "900",
                    }}
                  >
                    Status: {seq.active ? "Active" : "Paused"}
                  </div>
                  {seq.active ? (
                    <button
                      onClick={() => {
                        pauseHandler(seq._id);
                      }}
                      style={{
                        background: "red",
                        padding: ".5rem",
                        borderRadius: "10px",
                        color: "white",
                        fontWeight: "900",
                        fontSize: "1.2rem",
                      }}
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        continueHandler(seq._id);
                      }}
                      style={{
                        background: "green",
                        padding: ".5rem",
                        borderRadius: "10px",
                        color: "white",
                        fontWeight: "900",
                        fontSize: "1.2rem",
                      }}
                    >
                      Continue
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
