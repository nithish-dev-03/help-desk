
class HelpDeskExceptions(Exception):
    def __init__(self,status_code,detail,code):
        self.status_code = status_code
        self.detail = detail
        self.code = code
        super().__init__(detail)

class TicketNotFound(HelpDeskExceptions):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="Ticket not found",
            code="TICKET_NOT_FOUND",
        )

class AccessDenied(HelpDeskExceptions):
    def __init__(self):
        super().__init__(
            status_code=403,
            detail="You do not have permission to access this resource",
            code="ACCESS_DENIED",
        )

class EmailAlreadyExists(HelpDeskExceptions):
    def __init__(self):
        super().__init__(
            status_code=409,
            detail="Email is already registered",
            code="EMAIL_ALREADY_EXISTS",
        )
