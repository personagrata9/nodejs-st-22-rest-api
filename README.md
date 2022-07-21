# REST service with CRUD operations

Node version: v16.16.0

## How to start

Follow the steps below to install and run the service:

Step 1. Clone this repo.

Step 2. Install all modules listed as dependencies in package:

```bash
npm install
```

or

```bash
npm i
```

Step 3. Copy and rename env.example to .env

Step 4. Run the service using one of the options below:

1. development mode:

```bash
npm run start:dev
```

2. production mode - to start the build process and then run the bundled file:

```bash
npm run start:prod
```

Service by default use 3000 as the listening port. You can change port by setting the desired one in `.env` file at the root directory of the project (`PORT=port_number`) or using environment variable `PORT` when running the service.

## Implementation details

1. Endpoint `v1/users`:

- **GET** `v1/users` is used to get users collection

  - Server will answer with `status code` **200** and users records
  - You can get auto-suggest list from `limit` (by default limit is 10) users, sorted by login property and filtered by
    `loginSubstring` in the login property using query parameters (example: `localhost:3000/v1/users?limit=5&loginSubstring=1`)

- **GET** `v1/users/${userId}`

  - Server will answer with `status code` **200** and a record with `id === userId` if it exists
  - Server will answer with `status code` **400** and message **'Validation failed (uuid v 4 is expected)
    '**
    if `userId` is invalid (not `uuid`)
  - Server will answer with `status code` **404** and message **'user with id ${userId} not found'** if record with `id === userId` doesn't exist or is marked as deleted

- **POST** `v1/users` is used to create record about new user and store it in database

  - Server will answer with `status code` **201** and newly created record if succeed

- **PUT** `v1/users/${userId}` is used to update existing user

  - Server will answer with` status code` **200** and updated record if succeed
  - Server will answer with` status code` **400** and message **'Validation failed (uuid v 4 is expected)'** if `userId` is invalid (not `uuid`)
  - Server will answer with `status code` **404** and message **'user with id ${userId} not found'** if record with `id === userId` doesn't exist or is marked as deleted

- **DELETE** `v1/users/${userId}` is used to remove (soft delete) existing user
  - Server will answer with `status code` **204** if the record is found and marked as deleted
  - Server will answer with` status code` **400** and message **'Validation failed (uuid v 4 is expected)'** if `userId` is invalid (not `uuid`)
  - Server will answer with `status code` **404** and message **'user with id ${userId} not found'** if record with `id === userId` doesn't exist or is marked as deleted

2. Users are stored as `objects` that have following properties:

- `id` — unique identifier (`string`, `uuid`) generated on server side
- `login` — user login (`string`, **required**)
- `password` — user login (`string`, **required**) - must contain letters and numbers
- `age` — user age (`number`, **required**) - must be between 4 and 130
- `isDeleted` - flag to indicate if user is deleted (`boolean`, **required**)

## Testing

To test the service CRUD methods, you can use Postman (https://www.postman.com).
