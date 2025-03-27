import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Avatar, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    Grid,
    Paper
} from '@mui/material';
import { useAuth } from '../hooks/hooks';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type Connection = {
    id: number;
    name: string;
    selected?: boolean;
};

type Message = {
    text: string;
    connectionId: number;
    timestamp: Date;
};

const ConnectionsScreen = ({props}:any) => {

    const auth = useAuth();
    const [connections, setConnections] = useState<Connection[]>([
        { id: 1, name: 'Conexão Pessoal', selected: false },
        { id: 2, name: 'Conexão de Trabalho', selected: false },
        { id: 3, name: 'Conexão de Estudos', selected: false }
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [newConnectionName, setNewConnectionName] = useState('');
    const [connectionToDelete, setConnectionToDelete] = useState<number | null>(null);
    const [profile, setProfile] = useState<any>(null);


    console.log("UID: ", auth.user.uid);
    const docProfileRef = doc(db, 'users', auth.user.uid);

    useEffect(() => {
        const getProfile = async () => {
            const profile = await getDoc(docProfileRef);
            setProfile(profile.data());
        };
        getProfile();
    }
    , []);



    const handleAddConnection = () => {
        if (!newConnectionName.trim()) return;
        
        const newConnection: Connection = {
            id: Date.now(),
            name: newConnectionName.trim(),
            selected: false
        };
        
        setConnections([...connections, newConnection]);
        setNewConnectionName('');
        setOpenDialog(false);
    };

    const handleDeleteConnection = (id: number) => {
        setConnections(connections.filter(connection => connection.id !== id));
        setConnectionToDelete(null);
    };

    const handleSelectConnection = (id: number) => {
        setConnections(connections.map(connection => ({
            ...connection,
            selected: connection.id === id
        })));
    };

   

    const stringToColor = (str: string): string => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${hash % 360}, 70%, 50%)`;
    };

    const getInitials = (name: string): string => {
        return name.charAt(0).toUpperCase();
    };


    const ConnectionCard = ({ connection }: { connection: Connection }) => (
        <Paper elevation={3} className="p-4 rounded-xl hover:shadow-md transition-shadow">
            <Box className="flex flex-col items-center">
                <Avatar 
                    sx={{ 
                        bgcolor: stringToColor(connection.name),
                        width: 80, 
                        height: 80,
                        fontSize: '2rem',
                        mb: 2
                    }}
                >
                    {getInitials(connection.name)}
                </Avatar>
                <Typography variant="h6" className="font-medium text-center mb-2">
                    {connection.name}
                </Typography>
                <Box className="flex space-x-2">
                    <Button 
                        variant={connection.selected ? "contained" : "outlined"}
                        color="primary"
                        className="rounded-lg"
                        onClick={() => handleSelectConnection(connection.id)}
                    >
                        {connection.selected ? 'Selecionado' : 'Selecionar'}
                    </Button>
                    <Button
                        color="error"
                        onClick={() => setConnectionToDelete(connection.id)}
                        className="rounded-lg bg-red-50 hover:bg-red-100"
                    >
                        Excluir
                    </Button>
                </Box>
               
            </Box>
        </Paper>
    );

    const AddConnectionCard = () => (
        <Grid item xs={12} sm={6} md={4}>
            <Paper 
                elevation={3} 
                className="p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center min-h-full"
                onClick={() => setOpenDialog(true)}
            >
                <Box className="flex flex-col items-center">
                    <Avatar sx={{ 
                        bgcolor: 'action.selected', 
                        width: 80, 
                        height: 80,
                        mb: 2
                    }}>
                        +
                    </Avatar>
                    <Typography variant="h6" className="font-medium text-center">
                        Adicionar Conexão
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );


    const SignOutCard = () => (
        <Grid item xs={12} sm={6} md={4}>
            <Paper 
                sx={{ bgcolor: '#ef4444' }}
                elevation={3} 
                className="p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center min-h-full h-40"
                onClick={() => auth.signOut()}
            >
                <Box className="flex flex-col items-center bg-red-500 ">
                    
                    <Typography variant="h6" className="font-medium text-center">
                        SAIR
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );



    return (
        <Box className="min-h-screen bg-gray-50 p-6">
            <Box className="max-w-4xl mx-auto">
                <Box className="mb-8 text-center">
                    <Typography variant="h4" className="font-bold text-gray-800">
                        Conexões
                    </Typography>
                    <Typography variant="subtitle1" className="text-gray-500">
                        Gerencie suas conexões e envie mensagens
                    </Typography>
                    <Typography variant="h2" className="font-bold text-gray-800" margin={5}>
                        Olá, {profile?.username}
                    </Typography>
                </Box>

                <Grid container spacing={3} className="mb-8">
                    {connections.map((connection) => (
                        <Grid item xs={12} sm={6} md={4} key={connection.id}>
                            <ConnectionCard connection={connection} />
                        </Grid>
                    ))}
                    <AddConnectionCard />
                    <SignOutCard/>
                </Grid>


                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Adicionar Nova Conexão</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nome"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newConnectionName}
                            onChange={(e) => setNewConnectionName(e.target.value)}
                            className="mt-3"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                        <Button 
                            onClick={handleAddConnection} 
                            color="primary"
                            disabled={!newConnectionName.trim()}
                        >
                            Adicionar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog 
                    open={connectionToDelete !== null} 
                    onClose={() => setConnectionToDelete(null)}
                >
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Tem certeza que deseja excluir esta conexão? Esta ação não pode ser desfeita.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConnectionToDelete(null)}>Cancelar</Button>
                        <Button 
                            onClick={() => handleDeleteConnection(connectionToDelete!)} 
                            color="error"
                        >
                            Excluir
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default ConnectionsScreen;






