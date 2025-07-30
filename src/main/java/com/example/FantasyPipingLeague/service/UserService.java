package com.example.FantasyPipingLeague.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.FantasyPipingLeague.model.User;
import com.example.FantasyPipingLeague.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        List<User> users = (List<User>) userRepository.findAll();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    
}
