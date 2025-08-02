package com.example.FantasyPipingLeague.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.FantasyPipingLeague.dto.UserResponseDto;
import com.example.FantasyPipingLeague.model.User;
import com.example.FantasyPipingLeague.service.UserService;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/test-public")
    public ResponseEntity<String> testPublic() {
        System.out.println("=== Public test endpoint hit ===");
        return ResponseEntity.ok("Public endpoint working");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> authenticatedUser() {
        System.out.println("=== /users/me endpoint hit ===");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication: " + authentication);

        if (authentication == null) {
            System.out.println("No authentication found");
            return ResponseEntity.status(401).build();
        }

        System.out.println("Principal type: " + authentication.getPrincipal().getClass());
        User currentUser = (User) authentication.getPrincipal();
        System.out.println("User found: " + currentUser.getUsername());

        UserResponseDto userResponse = new UserResponseDto(currentUser);
        System.out.println("Returning response for: " + userResponse.getUsername());

        return ResponseEntity.ok(userResponse);
    }
    // ...existing code...

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
