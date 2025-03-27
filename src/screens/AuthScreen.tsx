
import { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Link, 
} from '@mui/material';
import { useAuth } from '../hooks/hooks';
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, setDoc, doc } from 'firebase/firestore';

export default function AuthScreen({props}:any){

    const auth = useAuth();

    console.log("Auth: ", auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [usernameReq, setUsernameReq] = useState(false);
    const [telephone, setTelephone] = useState('');
    const [telephoneReq, setTelephoneReq] = useState(false);

    const handleSubmit = (e:any) => {
        e.preventDefault();
    };

    const onEnter = () => {
        setUsernameReq(false);
        setTelephoneReq(false);

        if (email && password) {
            auth?.signIn(email, password)?.catch((error:Error) => {
                window.alert("Email ou senha incorretos");
            }).then((user:any) => {
                auth.setUser(user);
            });
        }else{
            window.alert("Preencha o email e a senha");
        }

    }

    const register = async (user:any) => {
        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
          username: username,
          email: email,
          telefone: telephone
        });

    
    }

    const onCadaster = () => {
        setUsernameReq(true);
        setTelephoneReq(true);

        if (email && password && username && telephone) {
            auth?.signUp(email, password)?.catch((error:Error) => {
                window.alert("Erro ao cadastrar");
            }).then((result:any) => {
                auth.setUser(result.user);
                console.log(result.user.uid);
                console.log(result.user);
                register(result.user);
            });
        }else{
            window.alert("Preencha todos os campos");
        }
    }


    return (
        <div className="h-full flex items-center justify-center bg-green-800">
            <Box 
            className="w-[40%] p-8 space-y-6 bg-white rounded-xl shadow-lg"
            component="form"
            onSubmit={handleSubmit}
            >
            <div className="text-center">
                <Typography variant="h4" className="font-bold text-gray-900">
                    Bem-vindo
                </Typography>
            </div>

            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-4"
                InputProps={{
                className: 'rounded-lg'
                }}
            />

            <TextField
                fullWidth
                label="Senha"
                variant="outlined"
                type={'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-2"
                InputProps={{
                className: 'rounded-lg',
                }}
            />

            <div className="registerFields w-full space-x-5">
                <TextField
                    label="Username (se cadastro)"
                    variant="outlined"
                    type={'text'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required = {usernameReq} 
                    InputProps={{
                    className: ' rounded-md ',
                    }}
                />
                <TextField
                    label="Telefone (se cadastro)"
                    variant="outlined"
                    type={'tel'}
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    required = {telephoneReq}
                    InputProps={{
                    className: ' rounded-md ',
                    }}
                />
                </div>

            <div className="flex items-center justify-between mb-4">
                
                <Link href="#" variant="body2" className="text-blue-600 hover:text-blue-800">
                Esqueceu a senha?
                </Link>
            </div>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
                onClick={onEnter}
            >
                Entrar
            </Button>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
                onClick={onCadaster}
            >
                Cadastrar
            </Button>


            </Box>
        </div>
    );
}