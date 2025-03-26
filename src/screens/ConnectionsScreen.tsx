import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Avatar, 
    IconButton, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    Grid,
    Paper
} from '@mui/material';

const ConnectionsScreen = () => {
  // Estado para armazenar os perfis
    const [profiles, setProfiles] = useState([
    { id: 1, name: 'Conexão Pessoal' },
    { id: 2, name: 'Conexão de Trabalho' },
    { id: 3, name: 'Conexão de Estudos' }
    ]);

    // Estado para controlar o diálogo de novo perfil
    const [openDialog, setOpenDialog] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');

    // Estado para controle do perfil a ser deletado
    const [profileToDelete, setProfileToDelete] = useState(null);

    // Função para adicionar novo perfil
    const handleAddProfile = () => {
    if (newProfileName.trim()) {
        const newProfile = {
        id: Date.now(), // Usando timestamp como ID temporário
        name: newProfileName.trim()
        };
        setProfiles([...profiles, newProfile]);
        setNewProfileName('');
        setOpenDialog(false);
    }
    };

    // Função para deletar perfil
    const handleDeleteProfile = (id:any) => {
    setProfiles(profiles.filter(profile => profile.id !== id));
    setProfileToDelete(null);
    };

    // Gerar cor baseada no nome do perfil (para o avatar)
    const stringToColor = (string:any) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
    };

    return (
    <Box className="min-h-screen bg-gray-50 p-6">
        <Box className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <Box className="mb-8 text-center">
            <Typography variant="h4" className="font-bold text-gray-800">
                Conexões
            </Typography>
            <Typography variant="subtitle1" className="text-gray-500">
            Selecione, adicione ou remova suas conexões
            </Typography>
        </Box>

        {/* Lista de Perfis */}
        <Grid container spacing={3} className="mb-8">
            {profiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
                <Paper elevation={3} className="p-4 rounded-xl hover:shadow-md transition-shadow">
                <Box className="flex flex-col items-center">
                    <Avatar 
                    sx={{ 
                        bgcolor: stringToColor(profile.name),
                        width: 80, 
                        height: 80,
                        fontSize: '2rem',
                        mb: 2
                    }}
                    >
                    {profile.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" className="font-medium text-center mb-2">
                    {profile.name}
                    </Typography>
                    <Box className="flex space-x-2">
                    <Button 
                        variant="contained" 
                        color="primary"
                        className="rounded-lg"
                    >
                        Selecionar
                    </Button>
                    <IconButton
                        color="error"
                        onClick={() => setProfileToDelete(profile?.id as any)}
                        className="rounded-lg bg-red-50 hover:bg-red-100"
                    >
                    </IconButton>
                    </Box>
                </Box>
                </Paper>
            </Grid>
            ))}

            {/* Card para adicionar novo perfil */}
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
                </Avatar>
                <Typography variant="h6" className="font-medium text-center">
                    Adicionar Conexão
                </Typography>
                </Box>
            </Paper>
            </Grid>
        </Grid>

        {/* Diálogo para adicionar novo perfil */}
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
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="mt-3"
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button 
                onClick={handleAddProfile} 
                color="primary"
                disabled={!newProfileName.trim()}
            >
                Adicionar
            </Button>
            </DialogActions>
        </Dialog>

        {/* Diálogo de confirmação para deletar */}
        <Dialog 
            open={profileToDelete !== null} 
            onClose={() => setProfileToDelete(null)}
        >
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
            <Typography>
                Tem certeza que deseja excluir este perfil? Esta ação não pode ser desfeita.
            </Typography>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setProfileToDelete(null)}>Cancelar</Button>
            <Button 
                onClick={() => handleDeleteProfile(profileToDelete)} 
                color="error"
            >
                Excluir
            </Button>
            </DialogActions>
        </Dialog>
        </Box>
    </Box>
    )};

export default ConnectionsScreen;