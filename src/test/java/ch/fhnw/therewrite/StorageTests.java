package ch.fhnw.therewrite;

import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.storage.*;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class StorageTests {

    @Autowired
    private FileSystemStorageService storageService;

    @MockBean
    private DocumentRepository documentRepository;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        StorageProperties properties = new StorageProperties();
        properties.setLocation(tempDir.toString());
        storageService = new FileSystemStorageService(properties, documentRepository);
        storageService.init();
    }

    @AfterEach
    void tearDown() throws Exception {
        Files.walk(tempDir)
                .filter(path -> !path.equals(tempDir))
                .forEach(path -> path.toFile().delete());
    }

    @Test
    void testStoreFileSuccessfully() throws Exception {
        MultipartFile multipartFile = new MockMultipartFile("testfile", "test.txt", "text/plain",
                "Hello World".getBytes());

        storageService.store(multipartFile);

        Path storedFilePath = tempDir.resolve("test.txt");
        assertThat(Files.exists(storedFilePath)).isTrue();
        assertThat(new String(Files.readAllBytes(storedFilePath))).isEqualTo("Hello World");
    }

    @Test
    void testStoreEmptyFile() {
        MultipartFile emptyFile = new MockMultipartFile("empty.txt", new byte[0]);

        StorageException thrown = assertThrows(
                StorageException.class,
                () -> storageService.store(emptyFile),
                "Expected store to throw, but it didn't");

        assertTrue(thrown.getMessage().contains("Failed to store empty file"));
    }

    @Test
    void testInitDirectory() throws IOException {
        Files.deleteIfExists(tempDir.resolve("testInit"));

        StorageProperties properties = new StorageProperties();
        properties.setLocation(tempDir.resolve("testInit").toString());
        FileSystemStorageService newStorageService = new FileSystemStorageService(properties, documentRepository);

        newStorageService.init();

        assertTrue(Files.isDirectory(tempDir.resolve("testInit")));
    }

    @Test
    void testLoadNonExistentFile() {
        assertThrows(
                StorageFileNotFoundException.class,
                () -> storageService.loadAsResource("nonexistent.txt"),
                "Expected loadAsResource to throw, but it didn't");
    }

}
