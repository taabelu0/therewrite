package ch.fhnw.therewrite.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "DocumentAccessToken")
public class DocumentAccessToken {
    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER) // needs eager
    @JoinColumn(name = "documentId", nullable = false)
    @JsonProperty
    private Document documentId;
    @GeneratedValue(generator = "uuid4")
    @GenericGenerator(name = "uuid4")
    @Column(name = "token")
    private UUID token;
    @Column(name = "datetime")
    private LocalDateTime dateTime;

    @Column(name="revokedDateTime")
    private LocalDateTime revokedDateTime;

    @PrePersist
    protected void onCreate() {
        dateTime = LocalDateTime.now();
        token = UUID.randomUUID();
    }

    public Document getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Document documentId) {
        this.documentId = documentId;
    }

    public UUID getToken() {
        return token;
    }

    public void setToken(UUID token) {
        this.token = token;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public LocalDateTime getRevokedDateTime() {
        return revokedDateTime;
    }

    public void setRevokedDateTime(LocalDateTime revokedDateTime) {
        this.revokedDateTime = revokedDateTime;
    }
}
