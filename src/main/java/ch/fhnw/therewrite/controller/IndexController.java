package ch.fhnw.therewrite.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class IndexController {
    @GetMapping(value = {"/"})
    public String index() {
        return "index";
    }
}
