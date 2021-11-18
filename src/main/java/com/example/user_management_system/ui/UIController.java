package com.example.user_management_system.ui;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UIController {

    @GetMapping("/home")
    public ModelAndView viewIndex() {
        return new ModelAndView("/static/index");
    }


    @GetMapping("/reset**")
    public ModelAndView viewReset() {
        return new ModelAndView("/templates/reset");
    }

}


