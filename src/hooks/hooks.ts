import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AuthContextType } from "../types/AuthTypes";

export function useAuth(){
    return useContext(AuthContext);
}