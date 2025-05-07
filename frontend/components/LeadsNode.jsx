import React, { useContext, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { Handle } from "@xyflow/react";
import ServerAPI from "../context/ServerContext";

const LeadsNode = () => {
  const { leads, setLeads } = useContext(ServerAPI);
  useEffect(() => {
    async function func() {
      var storedLeads = await JSON.parse(localStorage.getItem("leads"));
      if (storedLeads) {
        setLeads(storedLeads);
      }
    }
    func();
  }, []);
  const [open, setOpen] = React.useState(false);

  const [lead, setLead] = React.useState({ name: "", email: "" });

  const handleOpen = () => setOpen(!open);

  function leadChange(e) {
    setLead((l) => {
      return { ...l, [e.target.name]: e.target.value };
    });
  }

  function submitLead(e) {
    e.preventDefault();
    setLeads((l) => {
      return [...l, lead];
    });
    setLead({ name: "", email: "" });
  }

  return (
    <>
      <div className="custom-node" onClick={handleOpen}>
        <Handle type="source" position="bottom" />
        <div
          style={{
            height: "3rem",
            border: "1px solid black",
            padding: ".5rem 2rem",
            borderRadius: "10px",
            background: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {leads.length ? `Total ${leads.length} Leads Added` : "Add Leads"}
        </div>
        <Handle type="target" position="top" />
      </div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Manually Add Leads:</DialogHeader>
        <DialogBody>
          {!!leads.length && (
            <>
              <h5
                className=" text-xl flex justify-between"
                style={{ margin: "0 5rem" }}
              >
                <span>name</span>
                <span>email</span>
              </h5>

              {leads.map((element, index) => {
                return (
                  <h5
                    key={index}
                    className=" text-xl flex justify-between"
                    style={{ margin: "0 5rem" }}
                  >
                    <span>
                      {index + 1}. {element.name}
                    </span>
                    <span>{element.email}</span>
                  </h5>
                );
              })}
            </>
          )}
          <form onSubmit={submitLead}>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  placeholder="Enter lead's Name"
                  required
                  name="name"
                  value={lead.name}
                  onChange={leadChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  required
                  name="email"
                  value={lead.email}
                  onChange={leadChange}
                  placeholder="Enter Lead's Email"
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
        </DialogBody>
        <DialogFooter>
          <Button
            style={{ margin: "0 1rem 0 0" }}
            variant="gradient"
            color="black"
            onClick={() => {
              localStorage.removeItem("leads");
              setLeads([]);
              handleOpen();
            }}
          >
            <span>Remove Leads</span>
          </Button>
          <Button
            variant="gradient"
            color="black"
            onClick={async () => {
              if (!leads.length) {
                console.log("at least add one lead");
                return;
              } else {
                localStorage.setItem("leads", JSON.stringify(leads));
                handleOpen();
              }
            }}
          >
            <span>Insert Leads</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default LeadsNode;
