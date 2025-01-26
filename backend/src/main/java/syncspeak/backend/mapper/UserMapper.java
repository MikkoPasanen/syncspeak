package syncspeak.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import syncspeak.backend.entity.User;
import syncspeak.backend.entity.response.UserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "username", target = "username")
    UserResponse toUserResponse(User user);
}
