import Mongoose from "mongoose";
/*- ==================================================================================================== -*/


/*- MONGODB SCHEMAS -*/
/*- ==================================================================================================== -*/
const ContactSCHEMA = new Mongoose.Schema ({
  NAME : {
    type : String,
    required : true,
  },
  MOBILE : {
    type : String,
  },
  EMAIL : {
    type : String,
    required : true,
  },
  MESSAGE : {
    type : String,
    required : true,
  },
}, {
  collection : "CONTACT",
  timestamps : true
});
/*- ---------------------------------------------------------------------------------------------------- -*/
const NewsletterSCHEMA = new Mongoose.Schema ({
  EMAIL : {
    type : String,
    required : true,
  },
}, {
  collection : "NEWSLETTER",
  timestamps : true
});
/*- ---------------------------------------------------------------------------------------------------- -*/
const CONTACT = new Mongoose.model ("CONTACT", ContactSCHEMA);
const NEWSLETTER = new Mongoose.model ("NEWSLETTER", NewsletterSCHEMA);
const DB = {
  NAME : "AgniDB",
  PORT : 27017,
  CONTACT : CONTACT,
  NEWSLETTER : NEWSLETTER,
};
export default DB;
/*- ==================================================================================================== -*/