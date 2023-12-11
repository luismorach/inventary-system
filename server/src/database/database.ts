import { Pool} from 'pg'
 require ('dotenv').config()
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
})
console.log
console.log("DB conected")
export default pool;  