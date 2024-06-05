package ch.fhnw.therewrite.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;

@Entity
@Table(name = "Guest")
public class Guest {
    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER) // needs eager
    @JoinColumn(name = "documentId", nullable = false)
    @JsonProperty
    private Document documentId;

    @Column(name = "name")
    private String username;

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public Document getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Document documentId) {
        this.documentId = documentId;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
