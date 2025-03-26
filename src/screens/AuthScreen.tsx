
import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Link, 
    InputAdornment, 
    IconButton,
} from '@mui/material';


export default function AuthScreen({props}:any){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e:any) => {
    
        e.preventDefault();
        console.log('Email:', email, 'Password:', password);
        };
    
        const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
        };
    
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-2"
                InputProps={{
                className: 'rounded-lg',
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                    >
                    </IconButton>
                    </InputAdornment>
                ),
                }}
            />

            <div className="registerFields w-full space-x-5">
                <TextField
                    label="Username (se cadastro)"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                    className: ' rounded-md ',
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                        >
                        </IconButton>
                        </InputAdornment>
                    ),
                    }}
                />
                <TextField
                    label="Telefone (se cadastro)"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                    className: ' rounded-md ',
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                        >
                        </IconButton>
                        </InputAdornment>
                    ),
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
            >
                Entrar
            </Button>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
                Cadastrar
            </Button>
    

            </Box>
        </div>
    );
}