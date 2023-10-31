package ch.fhnw.therewrite.controller;
import ch.fhnw.therewrite.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Controller
public class DocumentController {
    private final StorageService storageService;

    public DocumentController(StorageService storageService) {
        this.storageService = storageService;
    }
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("pdfs", getAllPDFs());
        return "index";
    }
    private List getAllPDFs() {
        Stream<Path> pdfs = storageService.loadAll();
        return pdfs.map(
                path -> List.of(
                        path.getFileName().toString(),
                        "/view/"
                                + path.getFileName())).toList();
    }

    @GetMapping("/view/{pdfName}")
    public String pdfView(@PathVariable("pdfName") String pdfName, Model model) {
        model.addAttribute(pdfName);
        return "pdfViewer";
    }
    @GetMapping(
            value = "/pdf/get/{pdfName}",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public @ResponseBody byte[] getPDF(@PathVariable(value="pdfName") String pdfName) {
        try {
            Resource resource = storageService.loadAsResource(pdfName);
            InputStream in = resource.getInputStream();
            return in.readAllBytes();
        } catch (IOException exception) {
            // TODO: log exception
            return new byte[0];
        }
    }
}
