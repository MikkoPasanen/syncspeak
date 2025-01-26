package syncspeak.backend.config.filter;

import syncspeak.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);

        if (token != null && !token.isEmpty()) {
            String username = jwtService.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.isTokenValid(token, username)) {
                    System.out.println("JwtFilter: Token is valid");
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            username, null, null
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    System.out.println("JwtFilter: Token was not valid");
                }
            }
        }

        filterChain.doFilter(request, response);

    }

    public String extractToken(HttpServletRequest request) {
        System.out.println("extractToken called");
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            System.out.println("Cookies found");
            Optional<Cookie> authCookie = Arrays.stream(cookies)
                    .filter(cookie -> "auth-token".equals(cookie.getName()))
                    .findFirst();

            if(authCookie.isPresent()) {
                return authCookie.get().getValue();
            }
        } else {
            System.out.println("extractToken called");
        }

        return null;
    }
}
