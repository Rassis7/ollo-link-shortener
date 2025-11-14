export enum HTTP_STATUS_CODE {
  /**
   * 200 OK
   *
   * Indicates that the request has succeeded. The meaning of success varies depending on the HTTP method:
   * - GET: The resource has been fetched and is transmitted in the message body.
   * - POST: A resource has been created on the server.
   * - PUT: An existing resource was updated.
   *
   * Example usage: Returning user data after a successful GET request.
   */
  OK = 200,

  /**
   * 201 CREATED
   *
   * Indicates that the request has been fulfilled and resulted in a new resource being created.
   *
   * Example usage: Returning a status code after creating a new resource, like a user record.
   */
  CREATED = 201,

  /**
   * 202 ACCEPTED
   *
   * Indicates that the request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place.
   *
   * Example usage: Submitting a request for processing a long-running task, such as generating a report or processing a batch of data, where the task does not complete immediately.
   */
  ACCEPTED = 202,

  /**
   * 204 NO_CONTENT
   *
   * Indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response payload body.
   *
   * Example usage: A successful request to delete a resource or to update a resource without returning any data in the response body.
   */
  NO_CONTENT = 204,

  /**
   * 301 MOVED_PERMANENTLY
   *
   * Indicates that the requested resource has been definitively moved to a new URL provided in the Location header.
   *
   * Example usage: Redirecting short links to their original destination URLs.
   */
  MOVED_PERMANENTLY = 301,

  /**
   * 400 BAD_REQUEST
   *
   * Indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax).
   *
   * Example usage: The client sends a request with an invalid query parameter.
   */
  BAD_REQUEST = 400,

  /**
   * 401 UNAUTHORIZED
   *
   * Indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
   *
   * Example usage: A request to a protected resource without the correct authentication token.
   */
  UNAUTHORIZED = 401,

  /**
   * 403 FORBIDDEN
   *
   * Indicates that the server understood the request but refuses to authorize it.
   *
   * Example usage: A user trying to access another user's private data.
   */
  FORBIDDEN = 403,

  /**
   * 404 NOT_FOUND
   *
   * Indicates that the server can't find the requested resource.
   *
   * Example usage: A request for a resource that doesn’t exist on the server.
   */
  NOT_FOUND = 404,

  /**
   * 409 CONFLICT
   *
   * Indicates that the request could not be processed because of conflict in the request, such as an edit conflict in the case of multiple updates.
   *
   * Example usage: Trying to register a username that already exists.
   */
  CONFLICT = 409,

  /**
   * 422 UNPROCESSABLE_ENTITY
   *
   * Indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
   *
   * Example usage: Sending a request with valid JSON, but with invalid fields (e.g., a string where a number was expected).
   */
  UNPROCESSABLE_ENTITY = 422,

  /**
   * 429 TOO_MANY_REQUESTS
   *
   * Indicates the user has sent too many requests in a given amount of time ("rate limiting").
   *
   * Example usage: A client is rate-limited due to making too many requests to the server in a short period.
   */
  TOO_MANY_REQUESTS = 429,

  /**
   * 500 INTERNAL_SERVER_ERROR
   *
   * Indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
   *
   * Example usage: A generic error message when no more specific message is suitable.
   */
  INTERNAL_SERVER_ERROR = 500,
}
