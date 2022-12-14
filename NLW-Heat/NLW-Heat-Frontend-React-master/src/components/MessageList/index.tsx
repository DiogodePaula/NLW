import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { api } from '../../service/api'
import styles from './styles.module.scss' 

import logoImg from '../../assets/logo.svg'

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');
socket.on('new_message', (newMessage: Message) => {
    // fila de mensagens
    messagesQueue.push(newMessage);
})

export function MessageList(){
const [messages, setMessages] = useState<Message[]>([]);

useEffect(() => {
    setInterval(() => {
        if(messagesQueue.length > 0){
            setMessages(prevState => [
                messagesQueue[0],
                prevState[0],
                prevState[1],
            // esse filter vai remover valores nulos ou undefined da lista
            ].filter(Boolean))

            // vai remover o item mais antigo ali da fila de mensagens 
            messagesQueue.shift();
        }
    }, 2000)
},[])

useEffect(() => {
    api.get<Message[]>("/messages/last3").then(response =>{
        setMessages(response.data);        
    })
},[])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />
            <ul className={styles.messageList}>
                {messages.map(message => {
                    return(
                        <li key={message.id} className={styles.message}>
                            <p>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>                
                    )
                })}
            </ul>
        </div>
    )
}