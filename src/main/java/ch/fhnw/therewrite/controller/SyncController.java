package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.websocket.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

public class SyncController {
    @MessageMapping("/hello")
    @SendTo("/topic/msg")
    public Message greeting(Message message) {
        System.out.println(message);
        return new Message("Hello World!");
    }
}
