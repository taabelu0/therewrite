package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.websocket.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SyncController {
    @MessageMapping("/hello")
    @SendTo("/topic/msg")
    public Message messaging(String message) {
        return new Message("Hello World!: " + message);
    }
}
