import { useAuth } from "./hooks/hooks"
import AuthScreen from "./screens/AuthScreen"



export default function Switcher(){

    const auth = useAuth()

    return(
        <>
            {auth?.user? null:<AuthScreen/>}
        </>
    )
}