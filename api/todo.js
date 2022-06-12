
const util = require('util');
const jwt = require("jsonwebtoken")
const config = require('./config.json')
const responder = require('./../lib/responder')
module.exports = function(app,mysqlHandler,mysqlConnection) {

app.post("/signup", (req, res) => {

        try {

            let body = req.body;
            console.log(req.body);
            let first_name = body.First_name;
            let last_name = body.last_name;
            let emailadd = body.emailadd;
            let username = body.username;
            let password = body.password;
            console.log(first_name)
            let query = "insert into user_details (First_name,last_name,email_add,username,password) values (?,?,?,?,?)";
            let params = [first_name,last_name,emailadd,username,password];

            let userDetails = util.promisify(mysqlHandler)

            userDetails(query,params,mysqlConnection)
            .then((result) => {
                responder.respond(res,false,[],"User Sign up Successfully!!!!")
                // res.send({
                //     error:false,
                //     data:[],
                //     message:"User Sign up Successfully!!!!"
                // });
            })
            .catch((error) => {
                console.log(error)
                responder.respond(res,true,[],"Something went wrong")
                // res.send({
                //     error:true,
                //     data:[],
                //     message:"Something went wrong"
                // });
            })
           

        } catch(err) {
            console.log(err);
        }
    });

app.post("/signin",(req,res)=>{
    try {

        let body = req.body;
        console.log(req.body);
        let username = body.username;
        let password = body.password;
        let query = "select id from user_details where username=? and password=?";
        let params = [username,password];

        let userDetails = util.promisify(mysqlHandler)

        userDetails(query,params,mysqlConnection)
        .then((result) => {
           
            if(result.length){
                let userId = result[0].id;
                let token = jwt.sign({userId: userId}, config.privatekey)
                responder.respond(res,false,{"token":token},"User Found")
                // res.send({
                //     error:false,
                //     data:{
                //         "token" : token
                //     },
                //     message:"User Found"
                // });
            }
            else{
                responder.respond(res,true,[],"Invalid Creds")
                // res.send({
                //     error:true,
                //     data:[],
                //     message:"Invalid Creds"
                // });
            }
        })
        .catch((error) => {
            console.log(error)
            responder.respond(res,true,[],"Something went wrong")
            // res.send({
            //     error:true,
            //     data:[],
            //     message:"Something went wrong"
            // });
        })
       

    } catch(err) {
        console.log(err);
    }
});

app.post('/todo', (req,res)=>{
    try {
        let body = req.body;
        let token = body.headers.authorization;
        console.log(token)
        let userId ="";
        try{
            var decodeToken = jwt.verify(token,config.privatekey,function(err, decoded) {
                if (err) throw err;
                userId = decoded.userId;
            });
            

        }catch(err){
            console.log(err)
            responder.respond(res,true,[],"Invalid Token")
            // res.send({
            //     error : true,
            //     data: [],
            //     message : "Invalid token"
            // })
            return
        }
        let date = new Date();
        console.log(req.body);
        let task = body.task;
        if(task.length>10){
            responder.respond(res,true,[],"Task too long")
            // res.send({
            //     error:true,
            //     data:[],
            //     message:"Task too long"
            // })
            return
        }

        let query = "insert into todotasks (id,task,date) values (?,?,?)"
        let params = [userId,task,date];

        let userDetails = util.promisify(mysqlHandler)

        userDetails(query,params,mysqlConnection)
        .then((result) => {
            responder.respond(res,false,{"task":result.body},"Task added successfully")
            // res.send({
            //     error:false,
            //     data:{
            //         "task": result.body
            //     },
            //     message:"Task added successfully"
            // });
        })
        .catch((error) => {
            console.log(error)
            responder.respond(res,true,[],"Something went wrong")
            // res.send({
            //     error:true,
            //     data:[],
            //     message:"Something went wrong"
            // });
        })
       

    } catch(err) {
        console.log(err);
    }
});
app.get('/todolist', (req,res)=>{
    try {

        let body = req.body;
        let token = req.headers['authorization'];
        let userId ="";
        try{
            var decodeToken = jwt.verify(token,config.privatekey)
            userId = decodeToken.userId;

        }catch(err){
            responder.respond(res,true,[],"Invalid Token")
            return
        }
        console.log(req.body);
        let task = body.task;


        let query = "select * from todotasks where id=?"
        let params = [userId];

        let userDetails = util.promisify(mysqlHandler)

        userDetails(query,params,mysqlConnection)
        .then((result) => {
             
            result = result.map((item)=>{
                item ['taskid']=item['index'];
                delete item['index']
                item['userId']=item['id'];
                delete item['userId']
                item['taskName']= item['task']
                delete item['taskName']
                return item;
            })
            responder.respond(res,false,{"tasks":result},"Task Loaded")
            // res.send({
            //     error:false,
            //     data:{
            //         "tasks": result
            //     },
            //     message:"Task Loaded"
            // });
        })
        .catch((error) => {
            console.log(error)
            responder.respond(res,true,[],"Something went wrong")
            // res.send({
            //     error:true,
            //     data:[],
            //     message:"Something went wrong"
            // });
        })
       

    } catch(err) {
        console.log(err);
    }
});
app.get('/getprofile', (req,res)=>{
    try {

        let body = req.body;
        let token = req.headers['authorization'];
        let userId ="";
        try{
            var decodeToken = jwt.verify(token,config.privatekey)
            userId = decodeToken.userId;

        }catch(err){
            responder.respond(res,true,[],"invalid Token")
            // res.send({
            //     error : true,
            //     data: [],
            //     message : "Invalid token"
            // })
            return
        }
    


        let query = "select * from user_details where id=?"
        let params = [userId];

        let userDetails = util.promisify(mysqlHandler)

        userDetails(query,params,mysqlConnection)
        .then((result) => {
             
            result = result.map((item)=>{
                item ['userId']=item['id'];
                delete item['id']
                item['Fname']=item['First_name'];
                delete item['First_name']
                item['Lname']= item['last_name']
                delete item['last_name']
                item['Eadd']= item['email_add']
                delete item['email_add']
                item['userName']= item['username']
                delete item['username']
                delete item['password']
                return item;
            })
            responder.respond(res,false,{"tasks":result},"Profile Loaded")
            // res.send({
            //     error:false,
            //     data:{
            //         "tasks": result
            //     },
            //     message:"Profile Loaded"
            // });
        })
        .catch((error) => {
            console.log(error)
            responder.respond(res,true,[],"Something went wrong")
        })
       

    } catch(err) {
        console.log(err);
    }
});
app.delete("/delete",(req,res)=>{
    try {

        let body = req.query;
        console.log(body);
        let taskid = body.taskId;
        console.log(taskid)
        let query = "DELETE FROM `todotasks` WHERE `todotasks`.`index` = ?";
        let params = [taskid];

        let userDetails = util.promisify(mysqlHandler)

        userDetails(query,params,mysqlConnection)
        .then((result) => {
            responder.respond(res,false,[],"Task Deleted")
            //    res.send({
        //     error:false,
        //     data:[],
        //     message:"Task deleted"
        //    })
        })
        .catch((error) => {
            console.log(error)
            responder.respond(res,true,[],"Something went wrong")
        })
       

    } catch(err) {
        console.log(err);
    }
});
};