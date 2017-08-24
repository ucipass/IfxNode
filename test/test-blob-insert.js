// Test insertion of BLOB and CLOB data using memory buffer.
// First read the file into buffer and then pass buffer to ibm_db.
// Author : bimaljha@in.ibm.com

var common = require("./common")
    , ifxdb = require("../")
    , assert = require("assert")
    , fs = require('fs')
    , cn = common.connectionString
    , inputfile1 = 'data/phool.jpg'
    , inputfile2 = 'data/trc.fmt'
    , outputfile1 = 'phool2.jpg'
    , outputfile2 = 'trc2.fmt'
    ;

ifxdb.open(cn, function (err,conn) 
{
  if (err) 
  {
    console.log(err);
  }
  assert.equal(err, null);
  try {
      conn.querySync("drop table mytab");
  } catch (e) {};
  try {
    conn.querySync("create table mytab (empId int, photo BLOB(1M), trace CLOB(1M))");
    } catch (e) {};
  
  var img1= fs.readFileSync(inputfile1,'binary');
  var text= fs.readFileSync(inputfile2,'ascii');

  var len1 = img1.length;
  var len2 = text.length;
  console.log( "img1.length = " + len1);
  console.log( "text.length = " + len2);

  conn.prepare("insert into mytab(empId, photo, trace) VALUES (?, ?, ?)", 
      function (err, stmt) 
   {
    if (err) 
    {
      console.log(err);
      return conn.closeSync();
    }
    //var photo = [1, -2, -98, img1];  // We can use such array too.
    //var photo = {ParamType:"INPUT", CType:"BINARY", "SQLType:"BLOB", Data:img1};
    /*
     Default ParamType is 1(SQL_PARAM_INPUT)
     Default CType is 1 (SQL_C_CHAR)
     Default SQLType is 1. You must use SQLType or DataType
     if value is passed as JSON Object or Array.
     Except, numbers and string; all other datatypes like LOBS, GRAPHIC, File, etc
     must be passed as JSON Object or Array.
     */
    var photo = {ParamType:1, DataType: "BLOB", "Data":img1};
    var tracefile = {DataType: "CLOB", Data: text};

	stmt.execute([18, photo, tracefile], function (err, result) 
	{
      if( err ) console.log(err);  
      else result.closeSync();
	  
	  conn.prepare("select * from mytab", function (err, stmt)
      {
        if(err) 
        {
          console.log(err);
          return conn.closeSync();
        }

        stmt.execute([], function(err, result) {
          if(err) console.log(err);
          else 
          {
            data = result.fetchAllSync();
            fs.writeFileSync(outputfile1, data[0].PHOTO, 'binary');
            fs.writeFileSync(outputfile2, data[0].TRACE, 'ascii');
            try {
                conn.querySync("drop table mytab");
            } catch (e) {};
            result.closeSync();
  
            var size1 = fs.statSync(outputfile1)["size"];
            var size2 = fs.statSync(outputfile2)["size"];
            console.log("Lengths after select = " + size1+ ", " + size2);
            assert(len1, size1);
            assert(len2, size2);

            fs.unlinkSync(outputfile1);
            fs.unlink(outputfile2, function () { console.log('done'); });
          }
        });
      });
	});
  });
});

