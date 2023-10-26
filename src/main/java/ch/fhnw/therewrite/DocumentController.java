package ch.fhnw.therewrite;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
public class DocumentController {
    @GetMapping("/pdf")
    @ResponseBody
    public String pdf() throws IOException {
        Resource resource = new ClassPathResource("static/index.html");
        Path path = resource.getFile().toPath();
        return new String(Files.readAllBytes(path));
    }
    @GetMapping(
            value = "/pdf-download",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public @ResponseBody byte[] getImage() throws IOException {
        Resource resource = new ClassPathResource("uploads/sample.pdf");
        InputStream in = resource.getInputStream();
        return in.readAllBytes();
    }
}
