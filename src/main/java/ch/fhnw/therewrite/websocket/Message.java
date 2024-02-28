package ch.fhnw.therewrite.websocket;

import ch.fhnw.therewrite.data.Annotation;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public class Message implements Serializable {
    @JsonProperty
    Annotation message;

    @JsonProperty
    String type;
}
