  cd ./replay-lambda-function

  export DB_CONN=postgresql://bstenfors:zoipdrat@localhost:5432/transactions
  export DB_HOST=localhost
  export DB_NAME=transactions
  export DB_PORT=5432

  go clean
  go run .