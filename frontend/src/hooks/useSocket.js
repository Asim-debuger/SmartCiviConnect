import { useContext } from "react";
import SocketContext from "../context/SocketContextValue";

export default function useSocket() {
  return useContext(SocketContext);
}