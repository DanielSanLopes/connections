import { createContext, useState } from "react";
import { createUserWithEmailAndPassword,  onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";

export const AuthContext = createContext<any>(null);

const AuthProvider = ({children}:any) => {

  const Auth = auth;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const signUp = (email:string, password:string)=>
    createUserWithEmailAndPassword(Auth, email, password);


  const signIn = (email:string, password:string) =>
    signInWithEmailAndPassword(Auth, email, password)

  
  const signOut =  async () =>{
    await Auth.signOut();
  }


  onAuthStateChanged(Auth, (user) => {
    setUser(user);
    setLoading(false);
  }, (error) => {
    throw new Error("Some error occurred: " + error);
  });

  const values = {
    user: user,
    setUser,
    loading: loading,
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

export default AuthProvider;



