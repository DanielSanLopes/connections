import { createContext, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";


export const AuthContext = createContext<any>(null);

export const AuthProvider = ({children}:any) => {

  const Auth = getAuth();

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
    throw "Some error occurred: " + error;
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




