import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import { Button } from "@material-tailwind/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import LeadsNode from "./LeadsNode";
import EmailNode from "./EmailNode";
import WaitNode from "./WaitNode";
import AddNode from "./AddNode";
import ServerAPI from "../context/ServerContext";

const nodeTypes = {
  addNode: AddNode,
  leadsNode: LeadsNode,
  EmailNode: EmailNode,
  WaitNode: WaitNode,
};

const Sequence = () => {
  
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    sequence,
    setSequence,
    setLeads,
    deploySequenceAPI,
    sequenceName,
    setSequenceName,
  } = useContext(ServerAPI);

  useEffect(() => {
    async function func() {
      var storedSequence = await JSON.parse(localStorage.getItem("sequence"));
      if (storedSequence?.length) {
        setSequence(storedSequence);
      }
      console.log(storedSequence);
      var storedLeads = await JSON.parse(localStorage.getItem("leads"));
      if (storedLeads) {
        setLeads(storedLeads);
      }
      var storedSequenceName = localStorage.getItem("sequenceName");
      if (storedSequenceName) {
        setSequenceName(storedSequenceName);
      }
    }
    func();
  }, []);
  useEffect(() => {
    async function func() {
      var storedSequence = await JSON.parse(localStorage.getItem("sequence"));

      console.log(storedSequence);

      if (storedSequence?.length) {
        var storedNodes = [
          {
            id: "leader",
            type: "leadsNode",
            data: { label: "Hello" },
            position: { x: 550, y: 100 },
          },
        ];
        storedSequence.forEach((element, index) => {
          if (element.type === "task") {
            storedNodes.push({
              id: `email${index}`,
              data: { header: element.emailFormat.header },
              type: "EmailNode",
              position: { x: 550, y: (index + 1) * 150 + 100 },
            });
          } else if (element.type === "wait") {
            storedNodes.push({
              id: `Wait${index}`,
              type: "WaitNode",
              data: { wait: `${element.duration} seconds` },
              position: { x: 550, y: (index + 1) * 150 + 100 },
            });
          }
        });
        storedNodes.push({
          id: "adder",
          type: "addNode",
          position: { x: 592, y: (storedSequence.length + 1) * 150 + 100 },
        });

        var calculatedEdges = [];
        for (let i = 0; i < storedNodes.length - 1; i++) {
          calculatedEdges.push({
            id: `${i}-${i + 1}`,
            source: storedNodes[i].id,
            target: storedNodes[i + 1].id,
          });
        }
        console.log(storedNodes);
        console.log(calculatedEdges);
        setEdges(calculatedEdges);
        setNodes(storedNodes);
      }
    }

    func();
  }, [sequence]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback((changes) => {
    console.log(changes);
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params) => {
    console.log(params);
    setEdges((eds) => addEdge(params, eds));
  }, []);
  return (
    <>
      <div
        style={{
          borderRadius: "10px",
          width: "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "2rem 10%",
          placeItems: "center",
          gap: "1rem",
        }}
      >
        <label
          htmlFor="sequenceName"
          className="block text-sm font-medium text-gray-700"
          style={{ fontSize: "1.2rem" }}
        >
          Sequence Name
        </label>
        <input
          type="text"
          id="sequenceName"
          placeholder="Enter sequence's Name"
          required
          name="sequenceName"
          value={sequenceName}
          onChange={(e) => {
            setSequenceName(e.target.value);
          }}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
          style={{
            border: "1px solid gray",
            padding: ".5rem",
            width: "50%",
            fontSize: "1.2rem",
          }}
        />
        <Button
          type="submit"
          variant="gradient"
          color="black"
          onClick={() => {
            localStorage.setItem("sequenceName", sequenceName);
          }}
        >
          <span>Save Sequence Name</span>
        </Button>
      </div>
      <div
        style={{
          width: "80%",
          display: "flex",
          margin: "0 10%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "900" }}>Sequence:</h1>
        <Button
          variant="gradient"
          color="black"
          onClick={async () => {
            var storedSequence = localStorage.getItem("sequence");
            if (!storedSequence) {
              console.log("You needs to create a sequence first!");
              return;
            }
            var storedLeads = localStorage.getItem("leads");
            if (!storedLeads) {
              console.log("You need to add leads first!");
              return;
            }
            var storedSequenceName = localStorage.getItem("sequenceName");
            if (!storedSequenceName) {
              console.log("You need to save a Sequence name first!");
              return;
            }
            const sequenceData = new FormData();
            sequenceData.append("sequenceName", storedSequenceName);
            sequenceData.append("leads", storedLeads);
            sequenceData.append("sequence", storedSequence);
            console.log(storedLeads, storedSequence, storedSequenceName);
            deploySequenceAPI(sequenceData);
          }}
        >
          <span>Save And Deploy Sequence</span>
        </Button>
      </div>
      <div
        style={{
          border: "1px solid gray",
          borderRadius: "10px",
          width: "80%",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 10% 0 10%",
          placeItems: "center",
        }}
      >
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          colorMode="light"
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </>
  );
};

export default Sequence;
