import Navbar from "../components/Navbar";
import ServerProvider from "../context/ServerProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../components/HomePage";
import Sequence from "../components/Sequence";
import { ReactFlowProvider } from "@xyflow/react";
export default function App() {
  return (
    <>
      <ReactFlowProvider>
        <ServerProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/new_sequence" element={<Sequence />} />
            </Routes>
          </BrowserRouter>
        </ServerProvider>
      </ReactFlowProvider>
    </>
  );
}
