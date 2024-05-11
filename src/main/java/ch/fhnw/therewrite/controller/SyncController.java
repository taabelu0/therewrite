package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.websocket.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

@Controller
public class SyncController {

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @MessageMapping("/{documentId}")
    @SendTo("/session/{documentId}")
    public Message messaging(@DestinationVariable String documentId, Message message) {
        System.out.println("Websocket: User [id] in session  [" + documentId + "] send message: " + message);
        // TODO: check if message is valid
        return message;
    }
}
