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

## NOTES:

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)

/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

/feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)

/feed?page=4&limit=10 => 21-30 => .skip(20) & .limit(10)

Formula: skip = (page-1)\*limit;
