package ch.fhnw.therewrite.websocket;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Comment;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public class Message implements Serializable {
    @JsonProperty
    Annotation message;

    @JsonProperty
    Comment comment;

    @JsonProperty
    String type;
}
