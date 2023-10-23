package ch.fhnw.therewrite;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DocumentController {
    @GetMapping("/PDF")
    public String index() {
        return "forward:/index.html";
    }
}
