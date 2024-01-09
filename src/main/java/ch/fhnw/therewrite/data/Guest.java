package ch.fhnw.therewrite.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;

public class Guest {
    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2")
    @Column(name = "id")
    private UUID idGuest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "documentId", nullable = false)
    @JsonProperty
    private Document documentId;

    public void setId(UUID id) {
        this.idGuest= id;
    }

    public UUID getId() {
        return idGuest;
    }
}
