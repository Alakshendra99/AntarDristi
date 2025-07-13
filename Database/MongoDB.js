import LOG from "../Handlers/LOGGER.js";
import Mongoose from "mongoose";
const DB = {
  NAME : "AgniDB",
  PORT : 27017,
};
/*- ==================================================================================================== -*/


/*- MongoDB EVENT HANDLERS -*/
/*- ==================================================================================================== -*/
// MongoDB Connection Handler
async function Connect () {
  try {
    const MongoURL = "mongodb://localhost:" + DB.PORT + "/" + DB.NAME;
    await Mongoose.connect (MongoURL);
    LOG.SYSTEM ({ MESSAGE : "MONGODB CONNECTED", DATABASE : DB.NAME });
  } catch (Error) {
    LOG.CRITICAL ({ ERROR : "ERR-DBS:01", MESSAGE : "MONGODB CONNECTION FAILED", PATH : "./", LOG : 
      { NAME : Error.name, MESSAGE : Error.message, STACk : Error.stack, } });
    setTimeout (Connect, 1000);
  }
};

/*- ---------------------------------------------------------------------------------------------------- -*/

// MongoDB Disconnection Handler
async function Disconnect () {
  try {
    await Mongoose.disconnect();
    LOG.SYSTEM ({ MESSAGE : "MONGODB DISCONNECTED" });
  } catch (Error) {
    LOG.FATAL ({ ERROR : "ERR-DBS:02", MESSAGE : "MONGODB DISCONNECTION FAILED", PATH : "./", LOG : 
      { NAME : Error.name, MESSAGE : Error.message, STACk : Error.stack, } });
    process.exit(1);
  }
}

/*- ---------------------------------------------------------------------------------------------------- -*/

// MongoDB Connection Event Handlers
async function Events () {
  Mongoose.connection.on ('connected', async function () {
    LOG.SYSTEM ({ MESSAGE : "MONGODB CONNECTION ESTABLISHED" })
  });
  Mongoose.connection.on ('error', async function (Error) {
    LOG.CRITICAL ({ ERROR : "ERR-DBS:03", MESSAGE : "MONGODB ERROR", PATH : "./", LOG : 
      { NAME : Error.name, MESSAGE : Error.message, STACk : Error.stack, } });
  });
  Mongoose.connection.on ('disconnected', async function () {
    LOG.SYSTEM ({ MESSAGE : "MONGODB DISCONNECT DETECTED" });
    setTimeout (Connect, 1000);
  });
};
/*- ==================================================================================================== -*/


/*- ==================================================================================================== -*/
// MongoDB Object
const MongoDB = {
  Events : Events,
  Connect : Connect,
  Disconnect : Disconnect,
};
export default MongoDB;
/*- ==================================================================================================== -*/