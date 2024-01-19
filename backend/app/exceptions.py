class AppException(Exception):
    pass


class UserNotFound(AppException):
    # Not found username in database
    pass


class UserInactive(AppException):
    # User is inactive
    pass


class PasswordIncorrect(AppException):
    # password not matching with hashed_password
    pass


class UserAlreadyExists(AppException):
    # username was registered
    pass


class EmailAlreadyUsed(AppException):
    # email was used
    pass


class EmailNotFound(AppException):
    # email is not found
    pass


class InvalidPassword(AppException):
    def __init__(self, reason: str) -> None:
        self.reason = reason


class InvalidToken(AppException):
    # invalid token or expired token
    pass


class InvalidJWEDecode(AppException):
    # invalid JWE token data
    pass
