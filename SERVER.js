import Express from "express";
import MongoDB from "./Database/MongoDB.js";
import LOG from "./Handlers/LOGGER.js";

const URL = "127.0.0.1";
const PORT = 3000;

LOG.INFO ({ PROJECT : "ANTARDRISTI", AUTHOR : "ALAKSHENDRA SINGH" });
LOG.SYSTEM ({ MESSAGE : "SERVER STARTING", URL : URL, PORT : PORT });
/*- ==================================================================================================== -*/


/*- MONGODB CONNECTIONS -*/
/*- ==================================================================================================== -*/
await MongoDB.Connect();
await MongoDB.Events();
/*- ==================================================================================================== -*/


/*- SERVER INITALIZATION -*/
/*- ==================================================================================================== -*/
const App = Express();
App.set ('views', './Views');
App.set ( 'view engine', 'ejs' );
App.use ( Express.static('Public') );
App.use ( Express.json () );
App.use ( Express.urlencoded ({ extended: true }) );
App.use ( async function ( Error, Request, Response, next ) {
  if (Error instanceof SyntaxError && Error.status === 400 && 'body' in Error) {
    return Response.status(444).json({ MESSAGE : "JSON DATA WRONG FORMAT" });
  } next (Error);
});
App.use ( async function ( Request, Response, next ) {
  Request.url = Request.url.toUpperCase();
  next(); 
});
App.use ( async function ( Request, Response, next ) {
  Response.setHeader('Connection', 'close');
  next();
});
App.disable('x-powered-by');
App.disable('etag');
/*- ==================================================================================================== -*/
















/*- SERVER LISTENING -*/
/*- ==================================================================================================== -*/
App.listen (PORT, URL, function () {
  const ServerURL = { MESSAGE : "SERVER STARTED!", URL : URL, PORT : PORT };
  LOG.SYSTEM (ServerURL);
});
/*- ==================================================================================================== -*/


/*- SERVER EXIT -*/
/*- ==================================================================================================== -*/
const Delay = MS => new Promise(Resolve => setTimeout(Resolve, MS));

async function onExit () {
  LOG.WARN ({ MESSAGE : "SERVER CLOSING . . ."});
  await Delay(500);
  await MongoDB.Disconnect();
  LOG.SYSTEM ({ MESSAGE : "SERVER CLOSED!"});
  process.exit(0);
}

process.on ('SIGINT', async function () {
  LOG.FATAL ({ MESSAGE : "DETECTED : CONTROL + C"});
  onExit();
});
/*- ==================================================================================================== -*/