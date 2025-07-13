import Express from "express";
import MongoDB from "./Database/MongoDB.js";
import LOG from "./Handlers/LOGGER.js";
import DB from "./Database/SCHEMA.js"

const URL = "127.0.0.1";
const PORT = 3000;
const VERSION = "v1.0:2"

LOG.INFO ({ SERVER : "TANISHA DEBIAN SERVER (IN)", PROJECT : "ANTARDRISTI", AUTHOR : "ALAKSHENDRA SINGH", VERSION : VERSION });
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
App.set ('trust proxy', true);
App.use ( Express.static('Public') );
App.use ( Express.json () );
App.use ( Express.urlencoded ({ extended: true }) );
App.use ( async function ( Error, Request, Response, next ) {
  if (Error instanceof SyntaxError && Error.status === 400 && 'body' in Error) {
    return Response.status(444).json({ MESSAGE : "JSON DATA WRONG FORMAT" });
  } next (Error);
});
App.use ( async function ( Request, Response, next ) {
  Response.setHeader('Connection', 'close');
  next();
});
App.disable ('x-powered-by');
App.disable ('etag');
/*- ==================================================================================================== -*/


/*- SERVER ROUTES -*/
/*- ==================================================================================================== -*/
App.get ('/', async function ( Request , Response ) {
  const IP = Request.ip;
  LOG.TRACE ({ IP : IP, PATH : "GET ./" });
  Response.render('Landing');
});
/*- --------------------------------------------------------------------------------------------------- -*/
App.get ('/Builds', async function ( Request , Response ) {
  const IP = Request.ip;
  LOG.TRACE ({ IP : IP, PATH : "GET ./Builds" });
  Response.render('Builds');
});
/*- --------------------------------------------------------------------------------------------------- -*/
App.get ('/Family', async function ( Request , Response ) {
  const IP = Request.ip;
  LOG.TRACE ({ IP : IP, PATH : "GET ./Family" });
  Response.render('Family');
});
/*- --------------------------------------------------------------------------------------------------- -*/
App.get ('/Life', async function ( Request , Response ) {
  const IP = Request.ip;
  LOG.TRACE ({ IP : IP, PATH : "GET ./Life" });
  Response.render('Life');
});
/*- --------------------------------------------------------------------------------------------------- -*/
App.get ('/Contact', async function ( Request , Response ) {
  const IP = Request.ip;
  LOG.TRACE ({ IP : IP, PATH : "GET ./Contact" });
  Response.render('Contact', {
    ContactString : `<p class="cst-FormLabel cst-FormNecessary" style="visibility: hidden;">Issue Place Holder.</p>`,
  });
});
/*- --------------------------------------------------------------------------------------------------- -*/
App.post ('/Contact', async function ( Request , Response ) {
  const { Email, Name, Message } = Request.body;
  var { Mobile } = Request.body;
  if ( !Email || !Name || !Message ) {
    LOG.SECURITY ({ ERROR : "ERR-API:01", MESSAGE : "DATA MISSING", PATH : "POST ./Contact" });
    return Response.status(403).render('Message', {
      Title : `Forbidden`,
      Message : `<h1>WELCOME & HELLO THERE WEB TRAVELERS!</h1><h3>You Successfully Came Nowhere</h3><h2>403 - Forbidden</h2>`,
    });
  }
  if ( !Mobile ) {
    Mobile = "+91 90000 00000";
  }
  if ( (typeof Email !== 'string') || (typeof Name !== 'string') || (typeof Message !== 'string') || (typeof Mobile !== 'string') ) {
    LOG.SECURITY ({ ERROR : "ERR-API:02", MESSAGE : "INVALID DATA TYPE", PATH : "POST ./Contact" });
    return Response.status(403).render('Message', {
      Title : `Forbidden`,
      Message : `<h1>WELCOME & HELLO THERE WEB TRAVELERS!</h1><h3>You Successfully Came Nowhere</h3><h2>403 - Forbidden</h2>`,
    });
  }
  const MailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9._-]+$/;
  if( !(MailCheck.test(Email)) ) {
    LOG.AUDIT ({ ERROR : "ERR-USR:01", MESSAGE : "INVALID EMAIL", PATH : "POST ./Contact" });
    return Response.render('Contact', {
      ContactString : `<p class="cst-FormLabel cst-FormNecessary">E-Mail Format is Invalid</p>`,
    });
  }
  const NumberCheck = /^(\+91\s?)?[6-9]\d{4}\s?\d{5}$/;
  if( !(NumberCheck.test(Mobile)) ) {
    LOG.AUDIT ({ ERROR : "ERR-USR:02", MESSAGE : "INVALID MOBILE", PATH : "POST ./Contact" });
    return Response.render('Contact', {
      ContactString : `<p class="cst-FormLabel cst-FormNecessary">Mobile Number is Invalid</p>`,
    });
  }

  const ContactData = {
    NAME : Name,
    MOBILE : Mobile,
    EMAIL : Email,
    MESSAGE : Message
  };
  const Contact = new DB.CONTACT (ContactData);
  await Contact.save ();

  const IP = Request.ip;
  LOG.TRACE ({ IP : IP, PATH : "POST ./Contact" });
  return Response.render('Message', {
    Title : `Success`,
    Message : `<h1>FORM SUCCESSFULLY SENT</h1><h3>I WILL CONTACT YOU SOON</h3><h4>LETS GO BACK</h4><a href="/"><button class="btn btn-dark">Home</button></a>`,
  });
});
/*- --------------------------------------------------------------------------------------------------- -*/
App.post ('/Newsletter', async function ( Request , Response ) {
  const { Email } = Request.body;
  if ( !Email ) {
    LOG.SECURITY ({ ERROR : "ERR-API:01", MESSAGE : "DATA MISSING", PATH : "POST ./Newsletter" });
    return Response.status(403).render('Message', {
      Title : `Forbidden`,
      Message : `<h1>WELCOME & HELLO THERE WEB TRAVELERS!</h1><h3>You Successfully Came Nowhere</h3><h2>403 - Forbidden</h2>`,
    });
  }
  if ( (typeof Email !== 'string') ) {
    LOG.SECURITY ({ ERROR : "ERR-API:02", MESSAGE : "INVALID DATA TYPE", PATH : "POST ./Newsletter" });
    return Response.status(403).render('Message', {
      Title : `Forbidden`,
      Message : `<h1>WELCOME & HELLO THERE WEB TRAVELERS!</h1><h3>You Successfully Came Nowhere</h3><h2>403 - Forbidden</h2>`,
    });
  }
  const MailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9._-]+$/;
  if( !(MailCheck.test(Email)) ) {
    LOG.SECURITY ({ ERROR : "ERR-API:02", MESSAGE : "INVALID DATA TYPE", PATH : "POST ./Newsletter" });
    return Response.status(403).render('Message', {
      Title : `Forbidden`,
      Message : `<h1>WELCOME & HELLO THERE WEB TRAVELERS!</h1><h3>You Successfully Came Nowhere</h3><h2>403 - Forbidden</h2>`,
    });
  }

  const NewsletterData = {
    EMAIL : Email,
  };
  const Newsletter = new DB.NEWSLETTER (NewsletterData);
  await Newsletter.save ();

  const IP = Request.ip;
  LOG.TRACE ({ IP : IP, PATH : "POST ./Contact" });
  return Response.render('Message', {
    Title : `Success`,
    Message : `<h1>THANK YOU FOR NEWSLETTER SUBSCRIPTION</h1><h3>YOU ARE WON'T MISS MY UPDATES</h3><h4>LETS GO BACK</h4><a href="/"><button class="btn btn-dark">Home</button></a>`,
  });
});
/*- ==================================================================================================== -*/


/*- SERVER ERROR -*/
/*- ==================================================================================================== -*/
App.use ( async function ( Request , Response ) {
  const IP = Request.ip;
  LOG.SECURITY ({ IP : IP, PATH : Request.originalUrl });
  Response.status(404).render('Message', {
    Title : `Not Found`,
    Message : `<h1>WELCOME & HELLO THERE WEB TRAVELERS!</h1><h3>You Successfully Came Nowhere</h3><h2>404 - Not Found</h2>`,
  });
});
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
  LOG.WARN ({ MESSAGE : "SERVER CLOSING . . ." });
  await Delay(500);
  await MongoDB.Disconnect();
  LOG.SYSTEM ({ MESSAGE : "SERVER CLOSED!" });
  process.exit(0);
}

process.on ('SIGINT', async function () {
  LOG.FATAL ({ MESSAGE : "DETECTED : CONTROL + C" });
  onExit();
});
/*- ==================================================================================================== -*/