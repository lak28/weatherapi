const path = require("path");
const pool = require("../config/database");
const Procedure = require("../config/procedures");
const uuidFunction = require("../utils/uuidFunction");

//database connection created
const dbConn = pool.dbConn;
dbConn.connect();




// Api to get current weather of the city
module.exports.currentWeather = function (req, res) {
  let user = req.params;
  console.log('user',user);
  console.log("name", user.name);
  //validate name using regex
const nameToValidate = req.body.name;
const nameRegexp = /^[a-zA-Z0-9._-]{1,50}$/;
const nameValue =(nameRegexp.test(nameToValidate));
console.log("name validation is"+nameValue);

  //if name typed is null
  if (req.body.name == "") {
    return res
      .status(400)
      .send({  message: "User can't be blank/null" });
  }

  //if name is not valid(validation)
  console.log('namevalue',nameValue);
  if(nameValue == false){
    return res
    .status(400)
    .send({message : "Please enter a valid name"})
  }

  //call function to verify if name exist in database or not
  verifyName(
    user.name,
    () => {
      //function to get the current weather details of the city name
      dbConn.query(
        Procedure.ProcedureTable.getCurrent,
        [user.name],
        async function (error, results) {
          if (error) {
           throw error;
          }
       res.status(200).send({
        location:results[0][0]
       })
        });
    }
,
    (error,errorStatus) => {
      //if any error ocurred 
      res.status(errorStatus).send({
        status: error,
      });

    }
  );
  //if user doesnot exists then it will create a secret key and password for that user
};


// Api get forecast weather of the city
module.exports.forecastWeather = function (req, res) {
  try{
  let user = req.params;
  console.log('user',user);
  console.log("name", user.name);
  //validate name using regex
const nameToValidate = req.body.name;
const nameRegexp = /^[a-zA-Z0-9._-]{1,50}$/;
const nameValue =(nameRegexp.test(nameToValidate));
console.log("name validation is"+nameValue);

  //if name typed is null
  if (req.body.name == "") {
    return res
      .status(400)
      .send({  message: "User can't be blank/null" });
  }
  //if name is not valid(validation)
  console.log('namevalue',nameValue);
  if(nameValue == false){
    return res
    .status(400)
    .send({message : "Please enter a valid name"})
  }

  //call function to verify if name exist in database or not
  verifyName(
    user.name,
    () => {
          //function to get the forecast weather details of the city name
      dbConn.query(
        Procedure.ProcedureTable.getForecast,
        [user.name],
        async function (error, results) {
          if (error) {
           throw error;
          }
          console.log('forecast result',results);
       res.status(200).send({
        astro:results[0][0]
       })
        });
    }
,
    (error,errorStatus) => {
      //if any occurs
      res.status(errorStatus).send({
        status: error,
      });

    }
  );
  //if user doesnot exists then it will create a secret key and password for that user
}catch(error){
console.log(error);
}

};





//API to post weather detail of a city
module.exports.createName= function (req, res) {
  try {
    let user =req.body;
    console.log('data',user);
    //check if city name already exists in database
    checkName(user.name,()=>{
      //function to post city in database
      dbConn.query(
        Procedure.ProcedureTable.createData,
        [user.name,
          user.region ,
          user.country ,
          user.lat ,
          user.lon ,
          user.tz_id ,
          user.localtime_epoch ,
          user.localtime ,
          user.sunrise ,
          user.sunset ,
          user.moonrise ,
          user.moonset ,
          user.moon_phase ,
          user.moon_illumination ,
        ],
        async function (error, results) {
          if (error) {
          throw error;
          }
          console.log()
         res.status(200).send({
          status:"Name added succesfully"
         })
        });
    },(error,errorStatus)=>{
      //if any error occurs 
      res.status(errorStatus).send({
        status: error,
      });

    })

  } catch (error) {
    console.log(error);
  }
};




//function to check name already exists or not
function checkName(
  name,
  successCallback,
  errorCallback
) {
  const dbConn = pool.dbConn;

  try {
    dbConn.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");

      dbConn.query(
        Procedure.ProcedureTable.checkName,
        [name],
        async function (error, results) {
          if (error) {
            errorCallback(error.message,400);
          }
          if (results[0].length>0) {
            console.log(results);
            errorCallback(" User already exists!!",400);
          }else{
            successCallback();
          }
        });
    });
  } catch (error) {
    console.log(error);
  }
}


//function to verify name is their or not
function verifyName(
  name,
  successCallback,
  errorCallback
) {
  const dbConn = pool.dbConn;

  try {
    dbConn.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");

      dbConn.query(
        Procedure.ProcedureTable.checkName,
        [name],
        async function (error, results) {
          if (error) {
            errorCallback(error.message,400);
          }
          if (results[0].length>0) {
            successCallback();
          
          }else{
            errorCallback("name not found!!",400);
          }
        });
    });
  } catch (error) {
    console.log(error);
  }
}



