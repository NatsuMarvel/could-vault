const app = require('express')();

app.get('/',(req,res)=>{
    res.send('welcome to cloudvalut')
});

app.listen(8000);