const tasks = require("./routes/tasks");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();
const  Task  = require('./models/task');
const userSchema = require('./models/user')

connection();

app.use(express.json());
app.use(cors());

app.use("/api/tasks", tasks);

// using static files
app.use(express.static("./views"));
// to use encrypted data
app.use(express.urlencoded());

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// rendering the App Page
app.get('/', function(req, res){
    Task.find({}, function(err, task){
        if(err){
            console.log('Error in fetching tasks from db');
            return;
        }

        return res.render('home', {
            tittle: "Home",
            task: task
        });
    }
)});

app.get('/login', (req, res) => {
    res.render('login.ejs');
})
app.get('/registro', (req, res) => {
    res.render('registro.ejs');
})

// creating Tasks
app.post('/create-task', function(req, res){
    //  console.log("Creating Task");
      
      Task.create({
          description: req.body.description,
          category: req.body.category,
          date: req.body.date
          }, function(err, newtask){
          if(err){console.log('error in creating task', err); return;}
          
  
          //console.log(newtask);
          return res.redirect('back');
  
      });
  });
  
// deleting Tasks
app.get('/delete-task', function(req, res){
    // get the id from query
    var id = req.query;

    // checking the number of tasks selected to delete
    var count = Object.keys(id).length;
    for(let i=0; i < count ; i++){
        
        // finding and deleting tasks from the DB one by one using id
        Task.findByIdAndDelete(Object.keys(id)[i], function(err){
        if(err){
            console.log('error in deleting task');
            }
        })
    }
    return res.redirect('back'); 
});



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
