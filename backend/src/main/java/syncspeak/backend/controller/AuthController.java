package syncspeak.backend.controller;

import syncspeak.backend.entity.Role;
import syncspeak.backend.entity.User;
import syncspeak.backend.request.LoginRequest;
import syncspeak.backend.request.SignUpRequest;
import syncspeak.backend.response.LoginResponse;
import syncspeak.backend.service.AuthService;
import syncspeak.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody @Valid SignUpRequest req) {
        authService.checkIfUserExists(req.getUsername());

        User newUser = new User();
        newUser.setUsername(req.getUsername());
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));
        newUser.setRole(Role.USER.name());

        authService.saveUser(newUser);

        return new ResponseEntity<>("User registered!", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        User dbUser = authService.findUserByUsername(loginRequest.getUsername());

        if(passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
            String token = jwtService.generateToken(dbUser.getUsername());

            ResponseCookie cookie = ResponseCookie
                    .from("auth-token", token)
                    .path("/")
                    .maxAge(3600)
                    .sameSite("None")
                    .secure(true)
                    .httpOnly(true)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());

            LoginResponse loginResponse = new LoginResponse(
                    dbUser.getId(),
                    dbUser.getUsername(),
                    dbUser.getRole()
            );

            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }

        return new ResponseEntity<>(new LoginResponse(), HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/verify-token")
    public ResponseEntity<String> checkAuthentication(HttpServletRequest request, HttpServletResponse response) {
        if(!authService.checkIfTokenIsExpired(request)) {
            System.out.println("AuthController: User is authenticated");
            return new ResponseEntity<>("User is authenticated", HttpStatus.OK);
        } else {
            System.out.println("AuthController: User is not authenticated");

            ResponseCookie cookie = ResponseCookie
                    .from("auth-token", "")
                    .path("/")
                    .maxAge(0)
                    .sameSite("None")
                    .secure(true)
                    .httpOnly(true)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());

            return new ResponseEntity<>("User is not authenticated, log in again", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie
                .from("auth-token", "")
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .secure(true)
                .httpOnly(true)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return new ResponseEntity<>("User logged out", HttpStatus.OK);
    }

    @PostMapping("/secured")
    public ResponseEntity<String> getSecureEndpoint() {
        return new ResponseEntity<>("You have access to restricted places", HttpStatus.OK);
    }

    @GetMapping("/unsecured")
    public ResponseEntity<String> getUnsecureEndpoint() {
        return new ResponseEntity<>("This is public", HttpStatus.OK);
    }
}
