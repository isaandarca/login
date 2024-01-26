// const express = require("express");
// const app = express();
// const mongodb = require("mongodb");
// const bcrypt = require("bcrypt");
// const cors=require("cors");
// let MongoClient = mongodb.MongoClient;

// app.use(cors());

const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
var cors = require("cors");
app.use(cors());






app.use(express.urlencoded({ extended: false }));


let db;

MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  if (err !== null) {
    console.log(err);
  } else {
    db = client.db("protectorados");
  }
});

// app.post("/registro", function(req, res) {
//     let email = req.body.email;
//     let password = req.body.password;
  
//      let passwordCifrado = bcrypt.hashSync( password, 10 );
  
//     db.collection("administrador").insertOne({email: email, password: passwordCifrado,administrador:false}, function(err, result){
//       if(err !== null){
//         res.send({mensaje: "Error al registrar el usuario"} )
//       }else{
//         res.send({mensaje: "Usuario registrado correctamente"})
//       }
//     })
//   })


  
//   app.post("/login", function (req, res) {
//     let email = req.body.email;
//     let password = req.body.password;
 
   
//     db.collection("administrador")
//       .find({ email: email })
//       .toArray(function (err, administrador) {
//         if (err !== null) {
//           res.send({ mensaje: "Ha habido un error" });
//         } else {
//           if (administrador.length > 0) {
//             if (bcrypt.compareSync(password,   administrador[0].password)) {
//            res.send(administrador)
//             } else {
//               res.send({ mensaje: "Contraseña incorrecta" });
//             }
//           } else {
//             res.send({ mensaje: "No eres el administrador" });
//           }
//         }
//       });
//   });
  
 
const session = require("express-session");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      db.collection("administrador")
        .find({ email: email })
        .toArray(function (err, users) {
          if (users.length === 0) {
            done(null, false);
          }
          const user = users[0];
          if (password === user.password) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(function (id, done) {
  db.collection("administrador")
    .find({ email: id })
    .toArray(function (err, users) {
      if (users.length === 0) {
        done(null, null);
      }
      done(null, users[0]);
    });
});

app.post(
  "/api/login",
  passport.authenticate("local", {
    successRedirect: "/api",
    failureRedirect: "/api/fail",
  })
);

app.get("/api/fail", function (req, res) {
  res.status(401).send({ mensaje: "denegado" });
});

app.get("/api", function (req, res) {
  if (req.isAuthenticated() === false) {
    return res.status(401).send({ mensaje: "necesitas loguearte" });
  }
  res.send({ mensaje: "logueado correctamente" ,usuario:req.user});
});

app.post("/api/register", function (req, res) {
  db.collection("administrador").insertOne(
    {
      name: req.body.nombre,
      email: req.body.email,
      password: req.body.password,
    },
    function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send({ mensaje: "Registrado" });
      }
    }
  );
});

app.get("/api/user", function (req, res) {
  if (req.isAuthenticated()) {
    return res.send({ nombre: req.user.name });
  }
  res.send({ nombre: "No logueado" });
}); 









  app.get("/RegistroAnimal",function(req,res){
    res.send("/RegistroAnimal.html")
})






app.get("/listadoAnimales",function(req,res){
    db.collection("animales").find().toArray(function(err,datos){
        if (err!==null){
            res.send(err);
        }else{
            res.send(datos);
        }
    });
});
app.get("/listadoAnimales/:id",function(req,res){
    const id=req.params.id;
    db.collection("animales").find({id:id}).toArray(function(err,datos){
        if (err!==null){
            res.send(err);
        }else{
            res.send(datos);
        }
    });
});






app.get("/fichero/:Nombre",function(req,res){
    const Nombre=req.params.Nombre;
          
       db.collection("preadoptar").find({Nombre:Nombre}).toArray (function(err,datos){
           if(err!==null){
               res.send(error);
           }else{
               res.send(datos);
           }
       });
   });

   
   app.get("/fichero",function(req,res){
   
          
       db.collection("preadoptar").find().toArray (function(err,datos){
           if(err!==null){
               res.send(error);
           }else{
               res.send(datos);
           }
       });
   });
   








app.post("/registrarAnimal",function(req,res){
 const animal=req.body;
    db.collection("animales").insertOne(animal,function(err,datos){
        if(err!==null){
            res.send(err);
        }else{
            res.send(datos);
           
        }
    });
});

app.delete("/borrarAnimal", function (req, res) {
    const Nombre = req.body.Nombre;
    db.collection("animales").deleteOne({ Nombre: Nombre }, function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
  });

  app.post("/preadoptar",function(req,res){
  
      const preadoptar=req.body;
      db.collection("animales").find({Nombre:preadoptar.Nombre}).toArray(function(err,animales){
          if(err!==null){
              res.send(err);
          }else{
               if(animales.length===0){
                  res.send({mensaje:"Este animal no existe"})

              }else{
                  db.collection("preadoptar").insertOne({
                      Nombre:preadoptar.Nombre,
                      nombrePersona:preadoptar.nombrePersona,
                      email:preadoptar.email,
                      telefono:preadoptar.telefono,
                      poblacion:preadoptar.poblacion,
                      fechaPreadoptar:preadoptar.fechaPreadoptar,


                  },
                  function(err,datos){
                      if(err!==null){
                          res.send(err);
                      }else{
                          db.collection("animales").updateOne(
                              {Nombre:preadoptar.Nombre},
                              {$set:{Estado:"Adoptado"}},
                              function(err,data){
                                  if(err!==null){
                                      res.send(err);
                                  }else{
                                      res.send({mensaje:"Preadopcion en curso"})
                                  }
                              }
                          );
                      }
                  });
              }
          }
      });
  });








app.listen(3000);


