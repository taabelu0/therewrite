package ch.fhnw.therewrite.data;

import org.springframework.boot.test.context.SpringBootTest;
import ch.fhnw.therewrite.data.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

@ExtendWith(MockitoExtension.class)
public class UserTest {

    @Test
    public void testSetAndGetId() {

        User user = new User();

        UUID id = UUID.randomUUID();

        user.setIdUser(id);

        UUID retrievedId = user.getIdUser();

        Assertions.assertEquals(id, retrievedId);
    }
}
