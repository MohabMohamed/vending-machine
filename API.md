# API

## `POST /users`

Register new user.

Request:

```js
{
    username:   String,
    password: String,
    role: String
}
```

Response:

```js
{
    id: Number
    username:   String,
    password: String,
    role: String
}
```

Status codes:

```yaml
201:
  description: new user created.
400:
  description: Unable to register.
409:
  description: There is an account with the same username.
422:
  description: attributes validation error (like should be 8 characters long and should contain numbers and symbols).
```

## `POST /users/login`

Login a user.

Request:

```js
{
    username:   String,
    password: String
}
```

Response:

```js
{
  user: {
    id: Number
    username:   String,
    password: String,
    role: String},

    refreshToken:String,
    accessToken: String
}
```

Status codes:

```yaml
200:
  description: The user credentials are correct and he logged into the system.
401:
  description: The user credentials are wrong.
```

## `GET /users/logout`

Logout the user.

Status codes:

```yaml
200:
  description: the uer logged out successfully.
401:
  description: unauthorized or unauthenticated.
```

## `GET /refresh`

Let user get new access token.

Response:

```js
{
  user: {
    id: Number
    username:   String,
    password: String,
    role: String},

    accessToken: String
}
```

Status codes:

```yaml
200:
  description: the user got new access token successfully.
401:
  description: the refresh token of the user is expired or wrong, please re-login again.
```

## `GET /products/:productId`

Return product info by it's id.

Response:

```js
{
    id: Number,
    productName: String,
    amountAvailable: Number,
    cost: Number,
    sellerName: String
}
```

Status codes:

```yaml
200:
  description: product created successfully.
404:
  description: product not found.
```

## `POST /products`

Let user of type seller adds a new product.

Request:

```js
{
    productName: String,
    amountAvailable: Number,
    cost: Number
}
```

Response:

```js
{
    id: Number,
    productName: String,
    amountAvailable: Number,
    cost: Number,
    sellerId: Number
}
```

Status codes:

```yaml
200:
  description: product created successfully.
404:
  description: product not found.
```

## `GET /products?limit=10&&offset=0`

Return list of products.

Response:

```js
{
  ;[
    {
      id: Number,
      productName: String,
      amountAvailable: Number,
      cost: Number,
      sellerName: String
    }
  ]
}
```

Status codes:

```yaml
200:
  description: product created successfully.
404:
  description: product not found.
```

## `PUT /products/:productId`

Let user of type seller delete a product that he posted.

Request:

```js
{
    productName: String,
    amountAvailable: Number,
    cost: Number
}
```

Response:

```js
{
    id: Number,
    productName: String,
    amountAvailable: Number,
    cost: Number,
    sellerId: Number
}
```

Status codes:

```yaml
200:
  description: product updated successfully.
400:
  description: Unable to update the product please try again later.
401:
  description: unauthorized or unauthenticated.
404:
  description: product not found.
500:
  description: some thing wrong happened please try again later.
```

## `DELETE /products/:productId`

Let user of type seller delete a product that he posted.

Response:

```js
{
    id: Number,
    productName: String,
    amountAvailable: Number,
    cost: Number,
    sellerId: Number
}
```

Status codes:

```yaml
200:
  description: product deleted successfully.
400:
  description: Unable to delete the product please try again later.
401:
  description: unauthorized or unauthenticated.
404:
  description: product not found.
500:
  description: some thing wrong happened please try again later.
```

## `POST /deposit`

Add money to buyer account.

Request:

```js
{
  coins: [Number]
}
```

Response:

```js
{
    id: Number
    username:   String,
    password: String,
    role: String
}
```

Status codes:

```yaml
200:
  description: coins deposited successfully.
400:
  description: Unable to deposit.
401:
  description: unauthorized or unauthenticated.
404:
  description: user not found please re-login again.
500:
  description: something wrong happened please retry again latter.
```

## `POST /buy`

Make user of type buyer to buy a product.

Request:

```js
{
    productId: Number,
    amount: Number

}
```

Response:

```js
{
    totalSpent: Number
    productName:   String,
    amount: Number,
    change: [Number]
}
```

Status codes:

```yaml
200:
  description: the buying operation done successfully.
400:
  description: not enough amount available.
401:
  description: Sorry but you are unauthorized for this action or our session is expired please login again.
402:
  description: your account doesn't contain enough money.
404:
  description: product with this id not found
    or something wrong happened please logout and re-login again.
422:
  description: request body attributes validation error.
```

## `GET /reset`

Reset buyer deposit and returns the money in the response.

Response:

```js
{
  coins: [Number]
}
```

Status codes:

```yaml
200:
  description: buyer deposit reseted to zero successfully.
400:
  description: Unable to reset the deposit.
401:
  description: unauthorized or unauthenticated.
404:
  description: user not found please re-login again.
500:
  description: something wrong happened please retry again latter.
```
