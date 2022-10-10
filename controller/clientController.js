const path = require("path");
const pool = require("../config/database");
const Procedure = require("../config/procedures");
const uuidFunction = require("../utils/uuidFunction");
const fetch =require("node-fetch");
//database connection created
const dbConn = pool.dbConn;
dbConn.connect();


//key=829fc84dcfda428a8c2152808223009

// Api to get current weather of the city
module.exports.currentWeather = async function (req, res) {
  try{
  let user = req.params;
  console.log('user',user);
  console.log("name", user.name);
  //validate name using regex
const nameToValidate = user.name;
const nameRegexp = /^[a-zA-Z0-9._-]{1,50}$/;
const nameValue =(nameRegexp.test(nameToValidate));
console.log("name validation is"+nameValue);

  //if name typed is null
  if (user.name == "") {
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
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${user.key}&q=${user.name}&aqi=no`);
   
       var data = await response.json();
       console.log('fD',data);
       console.log('length', Object.keys(data).length);
       if( Object.keys(data).length>1){
       var city=data.location;
       
      dbConn.query(
        Procedure.ProcedureTable.getCurrent,
        [city.name,
          city.region ,
          city.country ,
          city.lat ,
          city.lon ,
          city.tz_id ,
          city.localtime 
        ],
        async function (error, results) {
          if (error) {
          throw error;
          }
      //function to get the current weather details of the city name
      console.log(results);
      return res.status(200).send({
        location:results[0]
      })
    
    })
  }else{
    res.status(404).send(data.error.message);
  }
  }catch(error){
    console.log(error);
  }
  //if user doesnot exists then it will create a secret key and password for that user
};


// Api get forecast weather of the city
module.exports.forecastWeather =async function (req, res) {
  try{
    let user = req.params;
    console.log('user',user);
    console.log("name", user.name);
    //validate name using regex
  const nameToValidate =user.name;
  const nameRegexp = /^[a-zA-Z0-9._-]{1,50}$/;
  const nameValue =(nameRegexp.test(nameToValidate));
  console.log("name validation is"+nameValue);
  
    //if name typed is null
    if (user.name == "") {
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
  
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${user.key}&q=${user.name}&days=1&aqi=no&alerts=no`);
         var data = await response.json();
         console.log('dd',data);
         console.log('length', Object.keys(data).length);
         if( Object.keys(data).length>1){
         var city=data.forecast.forecastday[0].astro;
         console.log('cityf',city);
        dbConn.query(
          Procedure.ProcedureTable.getForecast,
          [ data.location.name,
            city.sunrise,
            city.sunset ,
            city.moonrise ,
            city.moonset ,
            city.moon_phase ,
            city.moon_illumination ,
          ],
          async function (error, results) {
            if (error) {
            throw error;
            }
        //function to get the current weather details of the city name
        console.log(results);
        return res.status(200).send({
          astro:results[0]
        })
      
      })
    }else{
      res.status(404).send(data.error.message);
    }
    }catch(error){
      console.log(error);
    }

};








// //function to check name already exists or not
// function checkName(
//   name,
//   time,
//   successCallback,
//   errorCallback
// ) {
//   const dbConn = pool.dbConn;

//   try {
//     dbConn.connect(function (err) {
//       if (err) throw err;
//       console.log("Connected!");

//       dbConn.query(
//         Procedure.ProcedureTable.checkName,
//         [name,time],
//         async function (error, results) {
//           if (error) {
//             errorCallback(error.message,400);
//           }
//           if (results[0].length>0) {
//             console.log(results);
//             errorCallback(" User already exists!!",400);
//           }else{
//             successCallback();
//           }
//         });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }


// //function to verify name is their or not
// function verifyName(
//   name,
//   successCallback,
//   errorCallback
// ) {
//   const dbConn = pool.dbConn;

//   try {
//     dbConn.connect(function (err) {
//       if (err) throw err;
//       console.log("Connected!");

//       dbConn.query(
//         Procedure.ProcedureTable.checkName,
//         [name],
//         async function (error, results) {
//           if (error) {
//             errorCallback(error.message,400);
//           }
//           if (results[0].length>0) {
//             successCallback();
          
//           }else{
//             errorCallback("name not found!!",400);
//           }
//         });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }



