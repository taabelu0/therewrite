package ch.fhnw.therewrite.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Document")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // needs to be here
public class Document {
    @OneToMany(mappedBy = "documentId", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Annotation> annotations = new ArrayList<>();

    @OneToMany(mappedBy = "documentId", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Guest> guests = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonProperty
    private User UserCreator;

    @OneToMany(mappedBy = "documentId", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DocumentAccessToken> accessTokens = new ArrayList<>();

    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id")
    private UUID id;

    @Column(name = "documentName")
    private String documentName;

    @JsonIgnore
    private String path;

    @Column(name = "source", columnDefinition="TEXT")
    private String source;

    @Column(name = "copyRight", columnDefinition="TEXT")
    private String copyRight;


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

    public List<DocumentAccessToken> getAccessTokens() {
        return accessTokens;
    }

    public void setAccessTokens(List<DocumentAccessToken> accessTokens) {
        this.accessTokens = accessTokens;
    }

    public List<Guest> getGuests() {
        return guests;
    }

    public void setGuests(List<Guest> guests) {
        this.guests = guests;
    }

    public void addAnnotation(Annotation annotation) {
        this.annotations.add(annotation);
        annotation.setDocument(this);
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public void removeAnnotation(Annotation annotation) {
        this.annotations.remove(annotation);
        annotation.setDocument(null);
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSource() {
        return source;
    }

    public void setCopyRight(String copyRight) {
        this.copyRight = copyRight;
    }

    public String getCopyRight() {
        return copyRight;
    }

    public User getUserCreator() {
        return UserCreator;
    }

    public void setUserCreator(User userCreator) {
        UserCreator = userCreator;
    }
}