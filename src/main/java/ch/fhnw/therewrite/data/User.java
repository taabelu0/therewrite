package ch.fhnw.therewrite.data;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.springframework.data.annotation.Id;

import java.util.UUID;

@Entity
@Table(name = "RewriteUser")
public class User {

    @Id
    private UUID idUser = UUID.randomUUID();
    @jakarta.persistence.Id
    private Long id;

    public UUID getIdUser() {
        return idUser;
    }

    public void setIdUser(UUID idUser) {
        this.idUser = idUser;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
