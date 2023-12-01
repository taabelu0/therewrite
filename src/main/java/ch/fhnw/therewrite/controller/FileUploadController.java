package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.service.DocumentService;
import ch.fhnw.therewrite.storage.FileSystemStorageService;
import ch.fhnw.therewrite.storage.StorageFileNotFoundException;
import ch.fhnw.therewrite.storage.StorageService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.stream.Collectors;

@Controller
public class FileUploadController {

    private final FileSystemStorageService storageService;
    private final DocumentRepository documentRepository;

    public FileUploadController(FileSystemStorageService storageService, DocumentRepository documentRepository) {
        this.storageService = storageService;
        this.documentRepository = documentRepository;
    }

    @GetMapping("/upload")
    public String listUploadedFiles(Model model) {
        model.addAttribute("files", storageService.loadAll().map(
                path -> MvcUriComponentsBuilder.fromMethodName(FileUploadController.class,
                    "serveFile", path.getFileName().toString()).build().toUri().toString())
            .toList());
        return "uploadForm";
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);

        if (file == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @PostMapping("/file/upload")
    public String handleFileUpload(@RequestParam("file") MultipartFile file,
                                   RedirectAttributes redirectAttributes) {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if(!Objects.equals(extension, "pdf")){
            redirectAttributes.addFlashAttribute("message",
                "Please upload only files with the pdf extension");
        }else {
            Document document = new Document();

            document.setDocumentName(file.getOriginalFilename());
            documentRepository.save(document);
            String fileName = document.getId().toString() + ".pdf";
            String filePath = Paths.get(fileName).toString();
            document.setPath(filePath);
            documentRepository.save(document);
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
            redirectAttributes.addFlashAttribute("message",
                "You successfully uploaded " + file.getOriginalFilename() + "!");
        }
        return "redirect:/";
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound() {
        return ResponseEntity.notFound().build();
    }

}