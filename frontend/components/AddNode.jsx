import { Handle } from "@xyflow/react";
import React, { useContext } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { GrAdd } from "react-icons/gr";
import ServerAPI from "../context/ServerContext";

const AddNode = () => {
  const { sequence, setSequence, nodes, setNodes } = useContext(ServerAPI);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("default");
  const handleOpen = () => setOpen(!open);

  const [email, setEmail] = React.useState({ header: "", body: "" });
  function emailChange(e) {
    setEmail((em) => {
      return { ...em, [e.target.name]: e.target.value };
    });
  }
  function submitEmail(e) {
    e.preventDefault();
    setSequence((seq) => {
      return [...seq, { type: "task", task: "coldEmail", emailFormat: email }];
    });
    localStorage.setItem(
      "sequence",
      JSON.stringify([
        ...sequence,
        { type: "task", task: "coldEmail", emailFormat: email },
      ])
    );
    setEmail({ header: "", body: "" });
    setType("default");
    handleOpen();
  }
  const [wait, setWait] = React.useState({ duration: 1, unit: "days" });
  function waitChange(e) {
    setWait((w) => {
      return { ...w, [e.target.name]: e.target.value };
    });
  }
  function submitWait(e) {
    e.preventDefault();
    var duration = 0;
    if (wait.unit === "days") {
      duration = wait.duration * 24 * 60 * 60;
    } else if (wait.unit === "hours") {
      duration = wait.duration * 60 * 60;
    } else if (wait.unit === "minutes") {
      duration = wait.duration * 60;
    }
    setSequence((seq) => {
      return [...seq, { type: "wait", duration }];
    });
    localStorage.setItem(
      "sequence",
      JSON.stringify([...sequence, { type: "wait", duration }])
    );
    setWait({ duration: 1, unit: "days" });
    setType("default");
    handleOpen();
  }

  return (
    <>
      <div
        style={{
          // height: "3rem",
          border: "1px solid black",
          padding: "1rem 1rem",
          borderRadius: "10px",
          background: "white",
        }}
        onClick={handleOpen}
      >
        <Handle type="target" position="top" />
        <GrAdd />
        <Handle type="source" position="bottom" />
      </div>
      <Dialog open={open} handler={handleOpen}>
        {type === "default" && (
          <>
            <DialogHeader>Add New Node:</DialogHeader>
            <DialogBody>
              <Button
                variant="gradient"
                color="black"
                style={{ margin: "0 1rem 0 0" }}
                onClick={() => {
                  setType("email");
                }}
              >
                <span>Email Node</span>
              </Button>
              <Button
                variant="gradient"
                onClick={() => {
                  setType("wait");
                }}
                color="black"
              >
                <span>Wait Node</span>
              </Button>
            </DialogBody>
          </>
        )}
        {type === "email" && (
          <>
            <DialogHeader>Add Email Node:</DialogHeader>
            <DialogBody>
              <form onSubmit={submitEmail}>
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="header"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Header
                    </label>
                    <input
                      id="header"
                      placeholder="Enter email's Header"
                      required
                      name="header"
                      value={email.header}
                      onChange={emailChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="body"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Body
                    </label>
                    <input
                      id="body"
                      type="textarea"
                      required
                      name="body"
                      value={email.body}
                      onChange={emailChange}
                      placeholder="Enter email's body"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                    />
                  </div>
                  <div className="w-full grid place-items-center text-lg">
                    <Button type="submit" variant="gradient" color="black">
                      <span>Add</span>
                    </Button>
                  </div>
                </div>
              </form>
              <Button
                variant="gradient"
                color="black"
                style={{ margin: "0 1rem 0 0" }}
              >
                <span>Email Node</span>
              </Button>
              <Button variant="gradient" color="black">
                <span>Wait Node</span>
              </Button>
            </DialogBody>
          </>
        )}
        {type === "wait" && (
          <>
            <DialogHeader>Add Wait Node:</DialogHeader>
            <DialogBody>
              <form onSubmit={submitWait}>
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      duration
                    </label>
                    <input
                      type="number"
                      min="1"
                      id="duration"
                      placeholder="Enter wait's duration"
                      required
                      name="duration"
                      value={wait.duration}
                      onChange={waitChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="unit"
                      className="block text-sm font-medium text-gray-700"
                    >
                      unit
                    </label>
                    <select
                      id="unit"
                      required
                      name="body"
                      value={email.body}
                      onChange={emailChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                    >
                      <option value="days">days</option>
                      <option value="hours">hours</option>
                      <option value="minutes">minutes</option>
                    </select>
                  </div>
                  <div className="w-full grid place-items-center text-lg">
                    <Button type="submit" variant="gradient" color="black">
                      <span>Add</span>
                    </Button>
                  </div>
                </div>
              </form>
            </DialogBody>
          </>
        )}
      </Dialog>
    </>
  );
};

export default AddNode;
