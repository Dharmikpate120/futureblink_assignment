import React, { useContext } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import ServerAPI from "../context/ServerContext";

export default function SigninSignupModal() {
  const { signinAPI, signupAPI, userName } = useContext(ServerAPI);
  const [open, setOpen] = React.useState(false);
  const [signinData, setSigninData] = React.useState({
    email: "asdasdf@gmail.com",
    password: "asdasdfasdf",
  });
  const [signupData, setSignupData] = React.useState({
    name: "asdfasdf",
    email: "asdasdf@gmail.com",
    password: "asdasdfasdf",
  });

  const handleOpen = () => setOpen(!open);
  const signinChange = (e) => {
    setSigninData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const signupChange = (e) => {
    setSignupData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const signinSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(event.target);
    // console.log(formData.entries());
    await signinAPI(formData, handleOpen);
  };
  const signupSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData.entries());
    await signupAPI(formData, handleOpen);
  };
  return (
    <>
      <div className="m-5">
        <Button onClick={handleOpen} variant="gradient">
          {!!userName ? userName : "Signin / Signup"}
        </Button>
      </div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Sign In / Sign Up</DialogHeader>
        <DialogBody>
          <h5 className="w-full text-xl">Sign In</h5>
          <form onSubmit={signinSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label
                  htmlFor="signinemail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="signinemail"
                  placeholder="Enter your email"
                  required
                  name="email"
                  value={signinData.email}
                  onChange={signinChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="signinpassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="signinpassword"
                  type="password"
                  required
                  name="password"
                  value={signinData.password}
                  onChange={signinChange}
                  placeholder="Enter your password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                />
              </div>
              <div className="w-full grid place-items-center text-lg">
                <Button type="submit" variant="gradient" color="black">
                  <span>Signin</span>
                </Button>
              </div>
            </div>
          </form>

          <h1 className="w-full grid place-items-center text-lg">OR</h1>
          <h5 className="w-full text-xl">Sign Up</h5>
          <div className="space-y-4 py-4">
            <form onSubmit={signupSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  required
                  name="name"
                  value={signupData.name}
                  onChange={signupChange}
                  placeholder="Enter your email"
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
                  required
                  name="email"
                  value={signupData.email}
                  onChange={signupChange}
                  placeholder="Enter your email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  name="password"
                  value={signupData.password}
                  onChange={signupChange}
                  placeholder="Enter your password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
                />
              </div>
              <div className="w-full grid place-items-center text-lg">
                <Button type="submit" variant="gradient" color="black">
                  <span>Signup</span>
                </Button>
              </div>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
