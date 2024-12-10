import express from "express";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import bodyParser from "body-parser";

const app = express();
const port = 5000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,  
});
db.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post('/log', async (req,res) => {
    const {email,password} = req.body;
    try {
        const result = await db.query("SELECT email,password,name FROM users WHERE email = $1 AND password = $2",[email,password]);
        if(result.rows.length > 0){
            console.log(result.rows[0]);
            res.status(200).json({success:true, email: result.rows[0].email, name: result.rows[0].name})
        }else{
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Error", err);
    }
    // if(email === USER.email && password === USER.password){
    //     res.status(200).json({success :true, email: USER.email})
    // }else{
    //     res.status(401).json({success:false,message:'invalid'})
    // }
})


app.post("/register", async (req, res) => {
        const {email,password,name} = req.body;
        try {
            const result = await db.query("INSERT INTO users (email,password,name) VALUES($1,$2,$3)",[email,password,name]);
            res.status(200).json({ success: true,name: result.rows[0].name });  
        } catch (error) {
           console.log("error"); 
        }
    })


app.listen(port,() => {
    console.log("port is 5000")
});
