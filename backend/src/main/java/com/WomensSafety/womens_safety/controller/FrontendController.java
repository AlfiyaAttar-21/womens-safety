
package com.WomensSafety.womens_safety.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping({
        "/login",
        "/register",
        "/dashboard",
        "/trusted-contacts",
        "/safe-journey",
        "/incident-reporting",
        "/risk-map",
        "/ai-assistant",
        "/my-profile",
        "/verify-otp",
        "/forgot-password"
    })
    public String forwardPages() {
        return "forward:/index.html";
    }

    @GetMapping({
        "/consent/{id}",
        "/track/{id}"
    })
    public String forwardDynamicPages() {
        return "forward:/index.html";
    }
}
