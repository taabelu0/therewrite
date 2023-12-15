package ch.fhnw.therewrite.websocket;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public class Message implements Serializable {
    @JsonProperty
    String message;
}
