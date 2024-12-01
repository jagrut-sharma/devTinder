# API List

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit => does not allow editing email or password
- PATCH /profile/password => allows only password => different API for password

## connectionRequestRouter

- POST /request/send/like/:userId
- POST /request/send/pass/:userId
- POST /request/review/accept/:requestId
- POST /request/review/reject/:requestId

## user

- GET /user/connections
- GET /user/requests => requests received for user
- GET /user/feed => gives you your feed
