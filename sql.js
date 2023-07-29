import mysql from "mysql"

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "austria_jobs",
})

export const connect = () =>
  connection.connect((error) => {
    if (error) {
      console.error("Error connecting to MySQL:", error)
    } else {
      console.log("Connected to MySQL database!")
    }
  })

export const query = (statement) =>
  connection.query(statement, (error, results, fields) => {
    if (error) {
      console.error("Error executing the query:", error)
    } else {
        let kawaii = Array.from(results)
        console.log({kawaii, fields})
      return {kawaii, fields}
    }
  })

export const end = () =>
  connection.end((error) => {
    if (error) {
      console.error("Error closing the connection:", error)
    } else {
      console.log("Connection closed.")
    }
  })
