
# SQL Counter

Simple web server that shows a count based on the provided SQL.

## Getting Started

### 1. Clone the repo
```sh
$ git clone https://github.com/jackchuka/sql-counter.git
```

### 2. Copy config file
```sh
$ mv config/index.example.mjs config/index.mjs
```

### 3. Setup your config
```js
// your DB config
export const db_config = {
  host: 'localhost',
  user: 'user',
  password: 'password',
  port: '3306',
  database: 'yourdb',
};

export const queries = {
  // inital count
  initial: "SELECT count(1) AS count FROM items WHERE created < DATE(NOW())",
  // additional query for lighter DB load
  additional: "SELECT count(1) AS count FROM items WHERE created >= DATE(NOW())",
}

// your threashold value
export const threshold = 10000000;

// refresh interval
export const interval = 10000;
```

Config's `queries` expects `count` as an output so **DON'T forget to** place `AS count` in your query


### 4. Install Dependencies
```sh
$ yarn
```

### 5. Run the server
```sh
$ yarn run server
```

## Customize as your needs
Frontend of this repository is a minimum. Customize `index.html` as your needs, use your favorite frontend tool.

## Socket Events
| event | trigger |
| - | - |
| count_update | Will be triggered every time count is updated, based on interval you defined |
| threshold_reached | Will be triggered once count is reached to the threshold you defined (only once) |
