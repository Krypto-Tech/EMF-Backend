import express, { Router } from "express";

const router = express.Router();


app.get('/api/employees',async(req,res)=>{
    try{
      const result = await pool.query(
        'SELECT * FROM employees ORDER BY id ASC'
      );
  
      res.json({
        success:true,
        employees:result.rows
      })
  
    }catch(err){
      console.error('Error fetching employees',err.message);
  
      res.status(500).json({
        success:false,
        message:'Failed to fetch employees'
      })
    }
  })

export default router;

