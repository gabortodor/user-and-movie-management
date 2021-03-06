package com.example.controllers;

import java.security.NoSuchAlgorithmException;
import java.security.Principal;
import java.security.spec.InvalidKeySpecException;

import com.example.controllers.requests.AuthenticationRequest;
import com.example.controllers.requests.ResetRequest;
import com.example.controllers.responses.LoginResponse;
import com.example.user_management_system.registration.RegistrationService;
import com.example.user_management_system.registration.Request;
import com.example.user_management_system.security.jwt.JWTTokenHelper;
import com.example.user_management_system.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@RestController
@CrossOrigin
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    JWTTokenHelper jWTTokenHelper;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private RegistrationService registrationService;


    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest authenticationRequest) throws InvalidKeySpecException,
            NoSuchAlgorithmException {

        UsernamePasswordAuthenticationToken loginToken = new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(),
                authenticationRequest.getPassword());
        Authentication authenticatedUser = authenticationManager.authenticate(loginToken);
        SecurityContextHolder.getContext().setAuthentication(authenticatedUser);

        User user = (User) authenticatedUser.getPrincipal();

        String jwtToken = jWTTokenHelper.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse();
        response.setToken(jwtToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/api/register")
    public ResponseEntity<?> postRegistration(@RequestBody Request request) throws IllegalAccessException {
        if (request.checkAnyNull()) {
            return ResponseEntity.ok().body("Fill out all the fields");
        }

        if (!isMatchingPassword(request.getPassword(), request.getPasswordConfirm())) {
            return ResponseEntity.ok().body("Passwords not matching");
        }
        return ResponseEntity.ok().body(registrationService.registration(request));
    }

    @GetMapping(path = "/api/userinfo")
    public ResponseEntity<?> getUserInfo(Principal user) {
        User userObj = (User) userDetailsService.loadUserByUsername(user.getName());
        return ResponseEntity.ok(userObj);
    }

    @GetMapping(path = "/api/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
        return ResponseEntity.ok().body("Successfully logged out");
    }

    @PostMapping(path = "/api/reset")
    public ResponseEntity<?> postResetPassword(@RequestBody ResetRequest resetRequest) {
        if (!isMatchingPassword(resetRequest.getPassword(), resetRequest.getPassword_confirm())) {
            return ResponseEntity.ok().body("Passwords not matching");
        }
        if (registrationService.changePassword(resetRequest.getPassword(), resetRequest.getToken())) {
            return ResponseEntity.ok().body("Successfully changed password");
        }
        return ResponseEntity.ok().body("Cannot change password");
    }

    @PostMapping(path = "/home", params = "resetPassword")
    public ModelAndView postResetEmail(@RequestParam String email) {
        if (registrationService.sendPasswordResetEmail(email)) {
            return new ModelAndView("redirect:/home");
        } else {
            throw new IllegalStateException("Cannot send email.");
        }
    }

    @GetMapping(path = "/confirm")
    public ModelAndView getConfirm(@RequestParam(name = "token") String token) {
        if (registrationService.enableAccount(token)) return new ModelAndView("redirect:/home");
        throw new IllegalStateException("Cannot confirm account.");
    }

    public static boolean isMatchingPassword(String password, String password_confirm) {
        return password.equals(password_confirm);
    }

}
