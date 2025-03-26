import React, { useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    TextField,
    Button,
    Divider,
    Badge,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    InputAdornment
} from '@mui/material';

const ChatScreen = () => {
  // Estado para contatos e conversas
    const [contacts, setContacts] = useState([
        { id: 1, name: 'João Silva', avatar: 'JS', lastMessage: 'Oi, tudo bem?', unread: 2 },
        { id: 2, name: 'Maria Souza', avatar: 'MS', lastMessage: 'Vamos marcar aquela reunião', unread: 0 },
        { id: 3, name: 'Carlos Oliveira', avatar: 'CO', lastMessage: 'Enviei o arquivo que você pediu', unread: 1 }
    ]);

    const [selectedContact, setSelectedContact] = useState<any>();
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [messages, setMessages] = useState([
        [
        { id: 1, text: 'Oi, tudo bem?', sender: 'them', time: '10:30' },
        { id: 2, text: 'Estou bem, e você?', sender: 'me', time: '10:32' }
        ],
        [
        { id: 1, text: 'Vamos marcar aquela reunião', sender: 'them', time: '09:15' }
        ],
        [
        { id: 1, text: 'Enviei o arquivo que você pediu', sender: 'them', time: '14:45' },
        { id: 2, text: 'Obrigado, vou verificar!', sender: 'me', time: '14:50' }
        ]
    ]);

    // Função para adicionar novo contato
    const handleAddContact = () => {
        if (newContactName.trim()) {
        const newContact = {
            id: Date.now(),
            name: newContactName.trim(),
            avatar: newContactName.trim().split(' ').map(n => n[0]).join('').toUpperCase(),
            lastMessage: '',
            unread: 0
        };
        setContacts([...contacts, newContact]);
        setMessages({ ...messages, [newContact.id]: [] });
        setNewContactName('');
        setOpenAddDialog(false);
        }
    };

    // Função para remover contato
    const handleRemoveContact = (id:any) => {
        setContacts(contacts.filter(contact => contact.id !== id));
        if (selectedContact === id) {
        setSelectedContact(null as any);
        }
    };

    // Função para enviar mensagem
    const handleSendMessage = () => {
        if (newMessage.trim() && selectedContact) {
        const newMsg = {
            id: Date.now(),
            text: newMessage.trim(),
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages({
            ...messages,
            [selectedContact]: [...(messages[selectedContact] || []), newMsg]
        });

        // Atualiza última mensagem no contato
        setContacts(contacts.map(contact => 
            contact.id === selectedContact ? 
            { ...contact, lastMessage: newMessage.trim(), unread: 0 } : 
            contact
        ));

        setNewMessage('');
        }
    };

    // Filtra contatos pela busca
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box className="flex h-screen bg-gray-100">
        {/* Lista de Contatos */}
        <Box className="w-1/4 flex flex-col border-r border-gray-200 bg-white">
            {/* Cabeçalho da lista */}
            <Box className="p-4 border-b border-gray-200">
            <Typography variant="h6" className="font-bold">Contatos</Typography>
            
            {/* Barra de busca */}
            <TextField
                fullWidth
                placeholder="Buscar contatos..."
                variant="outlined"
                size="small"
                className="mt-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    </InputAdornment>
                ),
                }}
            />
            
            {/* Botão para adicionar contato */}
            <Button
                fullWidth
                variant="contained"
                className="mt-3"
                onClick={() => setOpenAddDialog(true)}
            >
                Adicionar Contato
            </Button>
            </Box>

            {/* Lista de contatos */}
            <List className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
                <ListItem
                key={contact.id}
                onClick={() => {
                    setSelectedContact(contact.id);
                    // Marcar como lido ao selecionar
                    setContacts(contacts.map(c => 
                    c.id === contact.id ? { ...c, unread: 0 } : c
                    ));
                }}
                className="hover:bg-gray-50"
                >
                <ListItemAvatar>
                    <Badge
                    badgeContent={contact.unread}
                    color="primary"
                    invisible={contact.unread === 0}
                    >
                    <Avatar className="bg-blue-500">
                        {contact.avatar}
                    </Avatar>
                    </Badge>
                </ListItemAvatar>
                <ListItemText
                    primary={contact.name}
                    secondary={contact.lastMessage}
                    secondaryTypographyProps={{
                    noWrap: true,
                    className: 'text-sm text-gray-500'
                    }}
                />
                <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveContact(contact.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                >
                </IconButton>
                </ListItem>
            ))}
            </List>
        </Box>

        {/* Área de Conversa */}
        <Box className="flex-1 flex flex-col">
            {selectedContact ? (
            <>
                {/* Cabeçalho do chat */}
                <Box className="p-4 border-b border-gray-200 flex items-center bg-white">
                <Avatar className="bg-blue-500 mr-3">
                    {contacts.find(c => c.id === selectedContact)?.avatar}
                </Avatar>
                <Typography variant="h6" className="font-bold">
                    {contacts.find(c => c.id === selectedContact)?.name}
                </Typography>
                </Box>

                {/* Mensagens */}
                <Box className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages[selectedContact]?.map((message) => (
                    <Box
                    key={message.id}
                    className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                    <Paper
                        elevation={1}
                        className={`max-w-xs p-3 rounded-xl ${message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                        <Typography>{message.text}</Typography>
                        <Typography
                        variant="caption"
                        className={`block text-right mt-1 ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}
                        >
                        {message.time}
                        </Typography>
                    </Paper>
                    </Box>
                ))}
                </Box>

                {/* Envio de mensagem */}
                <Box className="p-4 border-t border-gray-200 bg-white">
                <Box className="flex">
                    <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Digite uma mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="mr-2"
                    />
                    <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                    </IconButton>
                </Box>
                </Box>
            </>
            ) : (
            <Box className="flex-1 flex items-center justify-center bg-gray-50">
                <Typography variant="h6" className="text-gray-400">
                Selecione um contato para começar a conversar
                </Typography>
            </Box>
            )}
        </Box>

        {/* Diálogo para adicionar contato */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
            <DialogTitle>Adicionar Novo Contato</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Nome do Contato"
                type="text"
                fullWidth
                variant="outlined"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="mt-3"
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
            <Button 
                onClick={handleAddContact} 
                color="primary"
                disabled={!newContactName.trim()}
            >
                Adicionar
            </Button>
            </DialogActions>
        </Dialog>
        </Box>
    );
};

export default ChatScreen;