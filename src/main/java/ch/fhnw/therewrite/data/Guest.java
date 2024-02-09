package ch.fhnw.therewrite.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Guest")
public class Guest {
    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2")
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "documentId", nullable = false)
    @JsonProperty
    private Document documentId;

    @Column(name = "name")
    private String name;

    public UUID getId() {
        return id;
    }

    public Document getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Document documentId) {
        this.documentId = documentId;
    }

    public void setName(String name) {
        this.name = name;
    }
}
