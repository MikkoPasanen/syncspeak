package syncspeak.backend.controller;

import syncspeak.backend.entity.User;
import syncspeak.backend.entity.request.LoginRequest;
import syncspeak.backend.entity.request.SignUpRequest;
import syncspeak.backend.entity.response.LoginResponse;
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

    // Register user
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody @Valid SignUpRequest req) {
        // Check if another user with the same name exists, will throw an exception if exists
        authService.checkIfUserExists(req.getUsername());

        // Create a new user and save it in the database and return 201 CREATED
        User newUser = new User();
        newUser.setUsername(req.getUsername());
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));
        newUser.setRole("USER");

        authService.saveUser(newUser);

        return new ResponseEntity<>("User registered!", HttpStatus.CREATED);
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        // Check if user is found in the database
        User dbUser = authService.findUserByUsername(loginRequest.getUsername());

        // If password matches the found users password, proceed to grant login token and set it in the cookies and return 200 OK
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

            // Login response to frontend
            LoginResponse loginResponse = new LoginResponse(
                    dbUser.getId(),
                    dbUser.getUsername(),
                    dbUser.getRole()
            );

            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }

        // If there is a mismatch with password / username, return 401
        return new ResponseEntity<>(new LoginResponse(), HttpStatus.UNAUTHORIZED);
    }

    // Validate login token
    @PostMapping("/verify-token")
    public ResponseEntity<String> checkAuthentication(HttpServletRequest request, HttpServletResponse response) {
        // If token hasn't expired, proceed with 200 OK
        if(!authService.checkIfTokenIsExpired(request)) {
            return new ResponseEntity<>("User is authenticated", HttpStatus.OK);
        } else {
            // If token has expired or is missing, clear auth-token cookie and return 401
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

    // Logout user and clear login cookie
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
}
