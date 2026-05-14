package com.agaj.subhartiBackend.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping
    public String test(HttpServletRequest request) {

        // get enrollment from token
        String enrollment = (String) request.getAttribute("enrollment");

        return "Hello " + enrollment + ", you are authenticated!";
    }
}