import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'



const app=express()
app.use(express.json())
app.use(cors({
    origin:['http://localhost:5174'],
    methods:["POST","GET"],
    credentials:true
}))
app.use(cookieParser())
console.log("pass",process.env.DB_PASSWORD);
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password: process.env.DB_PASSWORD,
    database:'auth'
})
app.on("error",()=>{
    console.log("error:",error);
    throw error
})
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
    }
    console.log('Connected to the MySQL database.');
  });

app.get('/',(req,res)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(400).json({
            status:'Error',
            message:"You are not authorized"
        })
    }else{
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if(err){
                return res.status(400).json({
                    status:'Error',
                    message:"Token is not okay"
                })
            }else{
                req.name=decoded.name
                console.log("decoded",decoded);
                return res.status(200).json({
                    status:"success",
                    message:"User varified",
                    name:req.name
                })
            }
        })
    }
})
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Validate request body
    if (!name || !email || !password) {
        return res.json({
            status: 'error',
            message: 'Name, email, and password are required.'
        });
    }

    const sql = 'INSERT INTO register (name, email, password) VALUES (?, ?, ?)';

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error while hashing password'
            });
        }

        const values = [name, email, hash];
        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Email already exixts'
                });
            }

            return res.status(201).json({
                status: 'success',
                userInfo: result,
                message: 'User created successfully'
            });
        });
    });
});
app.post('/login',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            status:'error',
            message:"please enter email/password"
        })
    }
    const sql=`SELECT * FROM register WHERE email=?`;
    db.query(sql,[email],(err,data)=>{
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Login error in server'
            });
        }
        console.log("data of user:",data);
        if(data.length!==0){
            bcrypt.compare(password?.toString(),data[0]?.password,(err,response)=>{
                if(err) return res.status(400).json({status:"error",message:"Password compare Error"})
                if(response) {
                    const name=data[0].name;
                    const token=jwt.sign({name},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
                    res.cookie('token',token)
                    return res.status(200).json({status:"success",message:"user data fetched succesfully"})
                }else return res.status(400).json({status:"error",message:"password does not match"})

            })
        }else if(data.length===0){
            return res.status(500).json({status:"error",message:"email does not exists"})
        }
    })
})
app.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.status(200).json({status:"success",message:"User logged out successfully"})
})
app.listen(3000,()=>console.log(`server running at port http://localhost:3000`))




