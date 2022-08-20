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

Step 3. Copy and rename `env.example` to `.env`. Set up your credentials.

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

Service use PostgreSQL as a database system by default, if you need to use in-memory-database, please set up environment variable `NODE_ENV=test` when running the service or in .env file.

## Implementation details

1. Endpoint `v1/users`:

- **GET** `v1/users` - **protected (access JTW token must be provided)** - is used to get users collection

  - Service will answer with `status code` **200** and users records
  - You can get auto-suggest list from `limit` (by default limit is 10) users, sorted by login property and filtered by `loginSubstring` in the login property using query parameters. You can also specify an `offset` from where to start returning data (example: `localhost:3000/v1/users?limit=5&offset=2&loginSubstring=1`)

- **GET** `v1/users/${userId}` - **protected (access JTW token must be provided)**

  - Service will answer with `status code` **200** and a record with `id === userId` if it exists
  - Service will answer with `status code` **400** and message **'Validation failed (uuid v 4 is expected)'** if `userId` is invalid (not `uuid`)
  - Service will answer with `status code` **404** and message **'user with id \${userId} doesn't exist'** or **'user with id \${userId} is deleted'** if record with `id === userId` doesn't exist or is marked as deleted

- **POST** `v1/users` is used to create record about new user and store it in database

  - Service will answer with `status code` **201** and newly created record if succeed
  - Service will answer with `status code` **400** and detailed error message if request `body` does not contain **required** fields or fields are not valid

- **PUT** `v1/users/${userId}` - **protected (access JTW token must be provided)** - is used to update existing user

  - Service will answer with` status code` **200** and updated record if succeed
  - Service will answer with `status code` **400** and detailed error message if request `body` does not contain **required** fields or fields are not valid
  - Service will answer with` status code` **400** and message **'Validation failed (uuid v 4 is expected)'** if `userId` is invalid (not `uuid`)
  - Service will answer with `status code` **404** and message **'user with id \${userId} doesn't exist'** or **'user with id \${userId} is deleted'** if record with `id === userId` doesn't exist or is marked as deleted

- **DELETE** `v1/users/${userId}` - **protected (access JTW token must be provided)** - is used to remove (soft delete) existing user

  - Service will answer with `status code` **204** if the record is found and deleted
  - Service will answer with` status code` **400** and message **'Validation failed (uuid v 4 is expected)'** if `userId` is invalid (not `uuid`)
  - Service will answer with `status code` **404** and message **'user with id \${userId} doesn't exist'** or **'user with id \${userId} is deleted'** if record with `id === userId` doesn't exist or is marked as deleted

- Users are stored as `objects` that have following properties:

  - `id` — unique identifier (`string`, `uuid`) generated on Service side
  - `login` — user login (`string`, **required**) - must be unique
  - `password` — user login (`string`, **required**) - must contain letters and numbers
  - `age` — user age (`number`, **required**) - must be between 4 and 130
  - `isDeleted` - flag to indicate if user is deleted (`boolean`)

2. Endpoint `v1/groups`:

- **GET** `v1/groups` - **protected (access JTW token must be provided)** - is used to get groups collection

  - Service will answer with `status code` **200** and groups records
  - You can get list from `limit` (by default limit is 10) groups, sorted by name property using query parameters. You can also specify an `offset` from where to start returning data (example: `localhost:3000/v1/groups?limit=5&offset=2`)

- **GET** `v1/groups/${groupId}` - **protected (access JTW token must be provided)**

  - Service will answer with `status code` **200** and a record with `id === groupId` if it exists
  - Service will answer with `status code` **400** and message **'Validation failed (uuid v 4 is expected)'** if `groupId` is invalid (not `uuid`)
  - Service will answer with `status code` **404** and message **'group with id \${groupId} doesn't exist'** if record with `id === groupId` doesn't exist in database

- **POST** `v1/groups` - **protected (access JTW token must be provided)** - is used to create record about new group and store it in database

  - Service will answer with `status code` **201** and newly created record if succeed
  - Service will answer with `status code` **400** and detailed error message if request `body` does not contain **required** fields or fields are not valid

- **POST** `v1/groups/${groupId}` - **protected (access JTW token must be provided)** - is used to add users to certain group with `id === groupId` and store them in database

  - Service will answer with `status code` **201** if succeed
  - Service will answer with `status code` **400** and detailed error message if request `body` does not contain **required** field `userIds` or field is not valid

- **PUT** `v1/groups/${groupId}` - **protected (access JTW token must be provided)** - is used to update existing group

  - Service will answer with` status code` **200** and updated record if succeed
  - Service will answer with `status code` **400** and detailed error message if request `body` does not contain **required** fields or fields are not valid
  - Service will answer with` status code` **400** and message **'Validation failed (uuid v 4 is expected)'** if `groupId` is invalid (not `uuid`)
  - Service will answer with `status code` **404** and message **'group with id \${groupId} doesn't exist'** if record with `id === groupId` doesn't exist in database

- **DELETE** `v1/groups/${groupId}` - **protected (access JTW token must be provided)** - is used to remove (hard delete) existing group

  - Service will answer with `status code` **204** if the record is found and deleted
  - Service will answer with` status code` **400** and message **'Validation failed (uuid v 4 is expected)'** if `groupId` is invalid (not `uuid`)
  - Service will answer with `status code` **404** and message **'group with id \${groupId} doesn't exist'** if record with `id === groupId` doesn't exist in database

- Groups are stored as `objects` that have following properties:

  - `id` — unique identifier (`string`, `uuid`) generated on Service side
  - `name` — group name (`string`, **required**)
  - `permissions` — group permissions (`array of strings`, **required**) - allowed permissions values: 'READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'

3. Endpoint `v1/auth`:

- **POST** `v1/auth/login` is used to create record about JWT tokens (access token and refresh token) and store refresh token in database

  Request body:

  ```
  {
    "username": string,
    "password": string
  }
  ```

  - Service will answer with `status code` **201** and tokens if succeed
  - Service will answer with `status code` **400** and detailed error message if request `body` does not contain **required** fields or fields are not valid (not a string)
  - Service will answer with `status code` **401** and message **'username or password is incorrect'** if user record with provided credentials doesn't exist or is marked as deleted

- **GET** `v1/auth/refresh` - **protected (refresh JTW token must be provided)** - is used to refresh tokens

  - Service will answer with `status code` **200** and refreshed tokens if succeed

4. To access the protected routes the Bearer Token must be provided with the **Authorization: Bearer {JWT token}** HTTP header.

- Service will answer with `status code` **401** and message **'authorization required'** in case of the HTTP Authorization header is absent in the request
- Service will answer with `status code` **403** and message **'access denied'** if token is expired or invalid or if user record with provided JWT token doesn't exist or is marked as deleted

## Testing

To test the service CRUD methods you can use Postman (https://www.postman.com).
