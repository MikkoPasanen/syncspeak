package syncspeak.backend.service;

import syncspeak.backend.entity.User;
import syncspeak.backend.exception.UserAlreadyExistsException;
import syncspeak.backend.exception.UserNotFoundException;
import syncspeak.backend.filter.JwtFilter;
import syncspeak.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final JwtFilter jwtFilter;

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Couldn't find user with the name of: " + username));
    }

    public void checkIfUserExists(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            throw new UserAlreadyExistsException("User " + username + " already exists!");
        }
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public boolean checkIfTokenIsExpired(HttpServletRequest request) {
        String authToken = jwtFilter.extractToken(request);
        System.out.println("AuthService: " + authToken);
        if(authToken != null && !authToken.isEmpty()) {
            System.out.println("AuthService: Token was found");
            System.out.println("AuthService: Token expired: " + jwtService.isTokenExpired(authToken));
            return jwtService.isTokenExpired(authToken);
        }
        System.out.println("AuthService: Something broke");
        return true;
    }
}
