package ch.fhnw.therewrite.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.Id;

import java.util.UUID;

@Entity
@Table(name = "RewriteUser")
public class User {

    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id")
    private UUID idUser;


    public UUID getIdUser() {
        return idUser;
    }

    public void setIdUser(UUID idUser) {
        this.idUser = idUser;
    }

    public void setId(UUID id) {
        this.idUser= id;
    }

    public UUID getId() {
        return idUser;
    }
}
