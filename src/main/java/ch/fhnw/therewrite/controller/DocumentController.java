package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.security.AccessHelper;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import ch.fhnw.therewrite.security.AuthTuple;
import ch.fhnw.therewrite.storage.StorageFileNotFoundException;
import ch.fhnw.therewrite.storage.StorageService;
import jakarta.servlet.http.HttpSession;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/api/document")
public class DocumentController {
    private final DocumentRepository documentRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;
    private final AccessHelper accessHelper;
    @Autowired
    public DocumentController(DocumentRepository documentRepository, StorageService storageService, UserRepository userRepository, GuestRepository guestRepository) {
        this.documentRepository = documentRepository;
        this.storageService = storageService;
        this.userRepository = userRepository;
        this.guestRepository = guestRepository;
        this.accessHelper = new AccessHelper(documentRepository, guestRepository);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @GetMapping(
            value = "/{documentId}",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<byte[]> getDocument(@PathVariable String documentId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        AuthTuple<Boolean, Boolean> authTuple = accessHelper.getIsAuthorized(documentId, currentUser, guestId);
        if(!authTuple.userIsAuth() && !authTuple.guestIsAuth()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        UUID dId = UUID.fromString(documentId);
        Optional<Document> optionalDocument = documentRepository.findById(dId);
        if(optionalDocument.isPresent()) {
            Document d = optionalDocument.get();
            try {
                Resource resource = storageService.loadAsResource(d.getPath());
                InputStream in = resource.getInputStream();
                return ResponseEntity.status(HttpStatus.OK).body(in.readAllBytes());
            } catch (IOException exception) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

        }
        return new ResponseEntity(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/all")
    public List<Document> getDocumentList() {
        return documentRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all/{userId}")
    public ResponseEntity<List<Document>> getDocumentListByUser(@PathVariable String userId) {
        /*System.out.println(userId);
        UUID uId = UUID.fromString(userId);
        Optional<User> optionalUser = userRepository.findById(uId);
        if(optionalUser.isPresent()) {
            List<Document> allDoc = documentRepository.findAllByUser(optionalUser.get());
            return ResponseEntity.status(HttpStatus.OK).body(allDoc);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);*/
        return null;
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @GetMapping("/get/{documentId}")
    public ResponseEntity<Document> getDocumentById(@PathVariable String documentId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID dId = UUID.fromString(documentId);
        UUID guestId = (UUID) session.getAttribute("guestId");
        AuthTuple<Boolean, Boolean> authTuple = accessHelper.getIsAuthorized(documentId, currentUser, guestId);
        if(!authTuple.userIsAuth() && !authTuple.guestIsAuth()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        Optional<Document> optionalDocument = documentRepository.findById(dId);
        if(optionalDocument.isPresent()) {
            Document document = optionalDocument.get();
            return ResponseEntity.status(HttpStatus.OK).body(document);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }



    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<Document> saveDocument(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails currentUser) {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if(!Objects.equals(extension, "pdf")){
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(null);
        }
        else {
            Document document = new Document();

            document.setDocumentName(file.getOriginalFilename());
            documentRepository.save(document);
            String fileName = document.getId().toString() + ".pdf";
            String filePath = Paths.get(fileName).toString();
            document.setPath(filePath);
            List<User> users = document.getUsers();
            User user = userRepository.findByUsername(currentUser.getUsername());
            users.add(user);
            document.setUserCreator(user);
            document.setUsers(users);
            Document resp = documentRepository.save(document);
            try {
                MultipartFile storeFile = new MockMultipartFile(fileName,
                        fileName,
                        "application/pdf",
                        file.getInputStream());
                // MultipartFile storeFile = new MockMultipartFile(document.getId().toString() + ".pdf", file.getBytes());
                storageService.store(storeFile);
            }
            catch(IOException exception) {
                // TODO: log
            }
            resp.setUserCreator(user);
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
    }

    @PatchMapping("/{documentId}")
    public ResponseEntity<Document> updateDocument(@PathVariable UUID documentId, @RequestBody Document updateDetails) {
        return documentRepository.findById(documentId).map(document -> {
            document.setSource(updateDetails.getSource());
            document.setCopyRight(updateDetails.getCopyRight());
            documentRepository.save(document);
            return ResponseEntity.ok(document);
        }).orElse(ResponseEntity.notFound().build());
    }



    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{documentId}")
    public void deleteDocument(@PathVariable(value="documentId") String documentId, @AuthenticationPrincipal UserDetails currentUser) {
        if(currentUser == null) {
            return;
        }
        UUID dId = UUID.fromString(documentId);
        documentRepository.deleteById(dId);
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound() {
        return ResponseEntity.notFound().build();
    }
}
