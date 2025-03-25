import { UserCredential } from "firebase/auth";



export type AuthContextType = {
    user: any;
    setUser: (user: any) => any;
    loading: boolean;
    setLoading: (loading: boolean) => any;
    signUp: (email:string, password:string)=>Promise<UserCredential>;
    signIn: (email:string, password:string)=>Promise<UserCredential>;
    signOut: ()=>Promise<void>;
}