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

type Contact = {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    unread: number;
};

type Message = {
    id: number;
    text: string;
    sender: 'me' | 'them' | 'broadcast';
    time: string;
    isBroadcast?: boolean;
};

type Conversation = Message[];

const ChatScreen = () => {
    // Initial data
    const initialContacts: Contact[] = [
        { id: 1, name: 'João Silva', avatar: 'JS', lastMessage: 'Oi, tudo bem?', unread: 2 },
        { id: 2, name: 'Maria Souza', avatar: 'MS', lastMessage: 'Vamos marcar aquela reunião', unread: 0 },
        { id: 3, name: 'Carlos Oliveira', avatar: 'CO', lastMessage: 'Enviei o arquivo que você pediu', unread: 1 }
    ];

    const initialMessages: Record<number, Conversation> = {
        1: [
            { id: 1, text: 'Oi, tudo bem?', sender: 'them', time: '10:30' },
            { id: 2, text: 'Estou bem, e você?', sender: 'me', time: '10:32' }
        ],
        2: [
            { id: 1, text: 'Vamos marcar aquela reunião', sender: 'them', time: '09:15' }
        ],
        3: [
            { id: 1, text: 'Enviei o arquivo que você pediu', sender: 'them', time: '14:45' },
            { id: 2, text: 'Obrigado, vou verificar!', sender: 'me', time: '14:50' }
        ]
    };

    // State
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [messages, setMessages] = useState<Record<number, Conversation>>(initialMessages);
    const [isBroadcast, setIsBroadcast] = useState(false);

    // Derived values
    const selectedContact = contacts.find(contact => contact.id === selectedContactId);
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper functions
    const getCurrentTime = () => 
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const createNewMessage = (text: string, sender: 'me' | 'them' | 'broadcast'): Message => ({
        id: Date.now(),
        text,
        sender,
        time: getCurrentTime(),
        isBroadcast: sender === 'broadcast'
    });

    const updateLastMessage = (contactId: number, messageText: string) => {
        setContacts(contacts.map(contact => 
            contact.id === contactId 
                ? { ...contact, lastMessage: messageText, unread: 0 } 
                : contact
        ));
    };

    // Event handlers
    const handleAddContact = () => {
        if (!newContactName.trim()) return;

        const newContact: Contact = {
            id: Date.now(),
            name: newContactName.trim(),
            avatar: newContactName.trim().split(' ').map(n => n[0]).join('').toUpperCase(),
            lastMessage: '',
            unread: 0
        };

        setContacts([...contacts, newContact]);
        setMessages({ ...messages, [newContact.id]: [] });
        setNewContactName('');
        setIsAddDialogOpen(false);
    };

    const handleRemoveContact = (id: number) => {
        setContacts(contacts.filter(contact => contact.id !== id));
        if (selectedContactId === id) {
            setSelectedContactId(null);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const messageText = newMessage.trim();
        const newMsg = createNewMessage(messageText, isBroadcast ? 'broadcast' : 'me');

        if (isBroadcast) {
            // Send to all contacts
            const updatedMessages = { ...messages };
            const updatedContacts = [...contacts];
            
            contacts.forEach(contact => {
                updatedMessages[contact.id] = [...(updatedMessages[contact.id] || []), newMsg];
                updatedContacts.forEach(c => {
                    if (c.id === contact.id) {
                        c.lastMessage = `[Broadcast] ${messageText}`;
                        if (contact.id !== selectedContactId) {
                            c.unread += 1;
                        }
                    }
                });
            });

            setMessages(updatedMessages);
            setContacts(updatedContacts);
        } else if (selectedContactId) {
            // Send to selected contact
            const updatedMessages = {
                ...messages,
                [selectedContactId]: [...(messages[selectedContactId] || []), newMsg]
            };
            
            setMessages(updatedMessages);
            updateLastMessage(selectedContactId, messageText);
        }

        setNewMessage('');
    };

    const handleContactSelect = (contactId: number) => {
        setSelectedContactId(contactId);
        // Mark as read when selecting
        setContacts(contacts.map(contact => 
            contact.id === contactId ? { ...contact, unread: 0 } : contact
        ));
    };

    // Component rendering
    const renderContactList = () => (
        <Box className="w-1/4 flex flex-col border-r border-gray-200 bg-white">
            <Box className="p-4 border-b border-gray-200">
                <Typography variant="h6" className="font-bold">Contatos</Typography>
                
                <TextField
                    fullWidth
                    placeholder="Buscar contatos..."
                    variant="outlined"
                    size="small"
                    className="mt-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Button
                    fullWidth
                    variant="contained"
                    className="mt-3"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    Adicionar Contato
                </Button>
            </Box>

            <List className="flex-1 overflow-y-auto">
                {filteredContacts.map((contact) => (
                    <ListItem
                        key={contact.id}
                        onClick={() => handleContactSelect(contact.id)}
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
    );

    const renderMessage = (message: Message) => (
        <Box
            key={message.id}
            className={`flex mb-4 ${
                message.sender === 'me' ? 'justify-end' : 
                message.sender === 'broadcast' ? 'justify-center' : 'justify-start'
            }`}
        >
            <Paper
                elevation={1}
                className={`max-w-xs p-3 rounded-xl ${
                    message.sender === 'me' ? 'bg-blue-500 text-white' : 
                    message.sender === 'broadcast' ? 'bg-purple-500 text-white' : 'bg-white'
                }`}
            >
                {message.sender === 'broadcast' && (
                    <Typography variant="caption" className="block font-bold mb-1">
                        Broadcast:
                    </Typography>
                )}
                <Typography>{message.text}</Typography>
                <Typography
                    variant="caption"
                    className={`block text-right mt-1 ${
                        message.sender === 'me' ? 'text-blue-100' : 
                        message.sender === 'broadcast' ? 'text-purple-100' : 'text-gray-500'
                    }`}
                >
                    {message.time}
                </Typography>
            </Paper>
        </Box>
    );

    const renderChatArea = () => (
        <Box className="flex-1 flex flex-col">
            {selectedContact ? (
                <>
                    <Box className="p-4 border-b border-gray-200 flex items-center bg-white">
                        <Avatar className="bg-blue-500 mr-3">
                            {selectedContact.avatar}
                        </Avatar>
                        <Typography variant="h6" className="font-bold">
                            {selectedContact.name}
                        </Typography>
                    </Box>

                    <Box className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {messages[selectedContact.id]?.map(renderMessage)}
                    </Box>

                    <Box className="p-4 border-t border-gray-200 bg-white">
                        <Box className="flex items-center mb-2">
                            <Button
                                variant={isBroadcast ? "contained" : "outlined"}
                                color="secondary"
                                size="small"
                                onClick={() => setIsBroadcast(!isBroadcast)}
                            >
                                {isBroadcast ? "Enviando para todos" : "Enviar para todos"}
                            </Button>
                        </Box>
                        <Box className="flex">
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder={isBroadcast ? "Mensagem para todos os contatos..." : "Digite uma mensagem..."}
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
    );

    const renderAddContactDialog = () => (
        <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
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
                <TextField
                    autoFocus
                    margin="dense"
                    label="Telefone do Contato"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="mt-3"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button 
                    onClick={handleAddContact} 
                    color="primary"
                    disabled={!newContactName.trim()}
                >
                    Adicionar
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box className="flex h-screen bg-gray-100">
            {renderContactList()}
            {renderChatArea()}
            {renderAddContactDialog()}
        </Box>
    );
};

export default ChatScreen;