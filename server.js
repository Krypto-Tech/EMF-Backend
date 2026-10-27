const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./database');

const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing from environment variables');
}
app.use(express.json());



const EmployeeRoutes = require('./src/routes/EmployeeRoutes');

app.use('/api', EmployeeRoutes);

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users(email, password) VALUES($1, $2)',
      [email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'User created'
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
});




app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.json({
      success: true,
      token
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


app.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Token missing'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    res.json({
      success: true,
      user: decoded
    });

  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// app.get('/api/employees',async(req,res)=>{
//   try{
//     const result = await pool.query(
//       'SELECT * FROM employees ORDER BY id ASC'
//     );

//     res.json({
//       success:true,
//       employees:result.rows
//     })

//   }catch(err){
//     console.error('Error fetching employees',err.message);

//     res.status(500).json({
//       success:false,
//       message:'Failed to fetch employees'
//     })
//   }
// })

app.post('/api/employees',async(req,res)=>{
  try{
    const{name,profession,email,phone_number,salary} = req.body;
    if(
      typeof name != 'string' || !name.trim() || 
      typeof profession != 'string' || !profession.trim()

    ){
      return res.status(400).json({
        success:false,
        message:'Name and profession are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO employees (name,profession,email,phone_number,salary) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name.trim(),
       profession.trim(),
       email || null,
       phone_number || null,
       salary == '' || salary == null ? null : salary
      ]
      

    )

    res.status(201).json({
      success:true,
      message:result.rows[0]
    })
  }catch(err){
    console.error('Error Creating Employee ', err.message);

    res.status(500).json({
      success:true,
      message:'Failed to create an employee'
    })
  }
})

app.put('/api/employees/:id',async(req,res)=>{
  try{
    const{id} = req.params;
    const{name,profession,email,phone_number,salary} = req.body;

    if(!Number.isInteger(Number(id)) || Number(id) <= 0){
      return res.status(400).json({
        success:false,
        message:'Invalid Employee ID'
      })
    }

    if(typeof name !== 'string' || !name.trim() ||
       typeof profession !== 'string' || !profession.trim()
    ){
      return res.status(400).json({
        success:false,
        message:'Name and profession are required'
      })
    }

    const result = await pool.query(
      `UPDATE employees SET name = $1, profession = $2, email =$3, phone_number = $4, salary = $5 WHERE id = $6 RETURNING *`,
      [ 
        name.trim(),
        profession.trim(),
        email || null,
        phone_number || null,
        salary === '' || salary === null ? null : salary,
        Number(id)
      ]
    )
    if(result.rows.length == 0){
      return res.status(404).json({
        success:false,
        message:'Employee not found'
      })
    }

    return res.status(200).json({
      success:true,
      message:'Employee update successfully',
      data: result.rows[0]
    })
  }catch(err){
    console.error('Failed to update Employee',err);
    res.status(400).json({
      success:false,
      message:'Failed to update Employee'
    })
  }
})


app.delete('/api/employees/:id',async(req,res)=>{
  try{
    const{id} = req.params
    
    if(!Number.isInteger(Number(id)) || Number(id) <= 0){
      return res.status(400).json({
        success:false,
        message:'Invalid Employee Id'
      });
    }
     
    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING *',
      [Number(id)]
    );

    if(result.rows.length === 0){
      return res.status(404).json({
        success:false,
        message:'Employee not found'
      })
    }

    return res.status(200).json({
      success:true,
      message:'Employee Deleted Successfully',
      data: result.rows[0]
    });

  }catch(err){
    console.error('Failed to Delete Employee',err);
    return res.status(500).json({
      success:false,
      message:'Failed to delete employee'
    });

  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});