import { createContext, useState } from "react";
import { createUserWithEmailAndPassword,  onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({children}:any) => {

  const Auth = auth;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function signUp(email:string, password:string) {
    createUserWithEmailAndPassword(Auth, email, password);
  }

  function signIn(email:string, password:string) {
    signInWithEmailAndPassword(Auth, email, password)
  }
  
  async function signOut() {
    Auth.signOut();
  }


  onAuthStateChanged(Auth, (user) => {
    setUser(user);
    setLoading(false);
  }, (error) => {
    throw new Error("Some error occurred: " + error);
  });

  const values = {
    user,
    setUser,
    loading,
    setLoading,
    signUp,
    signIn,
    signOut,
  }
  
  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  )
}




