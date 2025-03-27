import { useAuth } from "./hooks/hooks"
import AuthScreen from "./screens/AuthScreen"
import ConnectionsScreen from "./screens/ConnectionsScreen"



export default function Switcher(){

    const auth = useAuth()

    console.log("Auth: ", auth)
    

    return(
        <>
            {auth?.user? <ConnectionsScreen auth = {auth}/>:<AuthScreen auth = {auth}/>}
        </>
    )
}