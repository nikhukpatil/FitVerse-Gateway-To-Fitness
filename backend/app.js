const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/User/auth.js');
const adminRoute = require('./routes/Admin/admin.js');
const userRoute = require('./routes/User/user.js')
const blogRoute = require('./routes/Blog/blog.js');
const dietPlanRoute = require('./routes/DietPlan/DietPlan.js');

dotenv.config({
    path:".env"
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '70mb' }));

app.get('/',(req, res)=>{
    res.send("Hello from the other side!");
})


app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/user', userRoute)
app.use('/api/blog', blogRoute)
app.use('/api/dietplan', dietPlanRoute)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
      success: false,
      status,
      message
    });
  });

module.exports = { app} ;