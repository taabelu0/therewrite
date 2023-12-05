package ch.fhnw.therewrite.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Document")
public class Document {
    @OneToMany(mappedBy = "documentId", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Annotation> annotations = new ArrayList<>();
    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id")
    private UUID id;

    private String documentName;

    @JsonIgnore
    private String path;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User userId;

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<Annotation> annotations) {
        this.annotations = annotations;
    }

    // Helper method to add an annotation
    public void addAnnotation(Annotation annotation) {
        this.annotations.add(annotation);
        annotation.setDocument(this);
    }

    // Helper method to remove an annotation
    public void removeAnnotation(Annotation annotation) {
        this.annotations.remove(annotation);
        annotation.setDocument(null);
    }
}