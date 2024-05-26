package ch.fhnw.therewrite.security;

public record AuthTuple<X, Y>(X userIsAuth, Y guestIsAuth) {
}
