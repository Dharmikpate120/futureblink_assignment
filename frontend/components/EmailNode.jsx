import { Handle } from "@xyflow/react";
import React from "react";

const EmailNode = ({ data }) => {
  return (
    <div
      style={{
        // height: "3rem",
        border: "1px solid black",
        padding: "1rem 1rem",
        borderRadius: "10px",
        background: "white",
        color: "gray",
      }}
    >
      <Handle type="target" position="top" />

      <h3 style={{ fontSize: "1.2rem", color: "black" }}>Email Block</h3>
      <Handle type="source" position="bottom" />
      {data.header}
    </div>
  );
};

export default EmailNode;
