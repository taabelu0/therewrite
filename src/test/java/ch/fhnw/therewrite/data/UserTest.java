package ch.fhnw.therewrite.data;

import org.springframework.boot.test.context.SpringBootTest;
import ch.fhnw.therewrite.data.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import java.util.UUID;

@SpringBootTest
public class UserTest {

    @Test
    public void testSetAndGetId() {

        User user = new User();

        UUID id = UUID.randomUUID();

        user.setId(id);

        UUID retrievedId = user.getId();

        Assertions.assertEquals(id, retrievedId);
    }
}
