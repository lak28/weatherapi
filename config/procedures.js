//list of mysql procedures

module.exports.ProcedureTable = {
  createData: "call SP_Create_Name(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
  checkName: "call SP_Check_Name(?)"  ,
  getForecast: "call SP_Get_Forecast(?)" ,
  getCurrent: "call SP_Get_Current(?)"
};
