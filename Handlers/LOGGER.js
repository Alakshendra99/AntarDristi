import Chalk from "chalk";
/*- ==================================================================================================== -*/


/*- LOGGER COLOUR SCHEMA -*/
/*- ==================================================================================================== -*/
const LoggingColour = {
  TIMESTAMP : "#F6F193",
  STRUCTURE : "#9AA6B2",
  LEVEL : {
    VERBOSE : "#DBDBDB",
    TRACE : "#FFD8D8",
    DEBUG : "#7F55B1",
    AUDIT : "#80D8C3",
    METRIC : "#ADDDD0",
    INFO : "#9EC6F3",
    SYSTEM : "#A8DF8E",
    WARN : "#FCB454",
    ERROR : "#FF8A8A",
    SECURITY : "#E53888",
    CRITICAL : "#FF0B55",
    FATAL : "#FF0000",    
  },
  DATA : {
    KEY : "#A8DF8E",
    VALUE : "#EEEEEE",
  },
};
/*- ==================================================================================================== -*/


/*- LOGGER FORMATER -*/
/*- ==================================================================================================== -*/
var LOGGING_MODE = "DEVELOPMENT";

/*- ---------------------------------------------------------------------------------------------------- -*/

function DateInIST () {
  const Time = new Date();
  const Day = String(Time.getDate()).padStart(2, '0');
  const Month = String(Time.getMonth() + 1).padStart(2, '0');
  const Year = Time.getFullYear();
  const Minute = String(Time.getMinutes()).padStart(2, '0');
  const Second = String(Time.getSeconds()).padStart(2, '0');
  let Hour = Time.getHours();
  const AmPm = Hour >= 12 ? 'PM' : 'AM';
  Hour = Hour % 12 || 12;
  Hour = String(Hour).padStart(2, '0');
  return `[ IST ${Day}/${Month}/${Year} ${Hour}:${Minute}:${Second} ${AmPm} ]`;
};

/*- ---------------------------------------------------------------------------------------------------- -*/

function ValuePrinter (Value, IndentLevel = 2) {
  const Indentation = '  '.repeat(IndentLevel);

  if (typeof Value === 'object' && Value !== null) {
    const entries = Object.entries(Value)
      .map(([key, value]) => {
        const keyColor = Chalk.hex(LoggingColour.DATA.KEY);
        return `${Indentation}${keyColor(key)}: ${ValuePrinter(value, IndentLevel + 1)}`;
      })
      .join('\n');
    return Chalk.hex(LoggingColour.STRUCTURE)(`{\n${entries}\n${'  '.repeat(IndentLevel - 1)}}`);
  }

  return Chalk.hex(LoggingColour.DATA.VALUE)(JSON.stringify(Value));
};

/*- ---------------------------------------------------------------------------------------------------- -*/

function LogFormater (Log, Level, Colour) {
  // DEPLOYED MODE LOGS
  if (LOGGING_MODE === "DEPLOYED") {
    const LOG = JSON.stringify(Log).replace(/:/g, ' : ').replace(/,/g, ' , ').replace(/{/, '{ ').replace(/}/, ' }');
    return `\n${Level} : ${LOG}`;
  } 
  
  // DEVELOPMENT MODE LOGS
  else {
    const TimeStamp = Chalk.hex(LoggingColour.TIMESTAMP)(DateInIST());
    const LogLevel =  Chalk.hex(Colour)(Level);

    const Body = Object.entries(Log)
      .map(([Key, Value]) => {
        const ColoredKey = Chalk.hex(LoggingColour.DATA.KEY)(Key);
        return `  ${ColoredKey} : ${ValuePrinter(Value)}`;
      });

    return Chalk.hex(LoggingColour.STRUCTURE)(`\n${TimeStamp} ${LogLevel} : {\n${Body.join('\n')}\n}`);
  }
};
/*- ==================================================================================================== -*/


/*- LOGGER FORMATER -*/
/*- ==================================================================================================== -*/
function LOG_START (MODE) {
  if (MODE === "DEVELOPMENT") {
    LOGGING_MODE = "DEVELOPMENT";
  } else if (MODE === "DEPLOYED") {
    LOGGING_MODE = "DEPLOYED";
  } else {
    LOGGING_MODE = "DEVELOPMENT";
    LOG_CRITICAL ({ ERROR : "ERR-LOG:01", MESSAGE : "LOGGING MODE NOT DEFINED", PATH : "./" });
  }
}
function LOG_VERBOSE (Message) {
  process.stdout.write(LogFormater(Message, "VERBOSE", LoggingColour.LEVEL.VERBOSE));
}
function LOG_TRACE (Message) {
  process.stdout.write(LogFormater(Message, "TRACE", LoggingColour.LEVEL.TRACE));
}
function LOG_AUDIT (Message) {
  process.stdout.write(LogFormater(Message, "AUDIT", LoggingColour.LEVEL.AUDIT));
}
function LOG_DEBUG (Message) {
  process.stdout.write(LogFormater(Message, "DEBUG", LoggingColour.LEVEL.DEBUG));
}
function LOG_METRIC (Message) {
  process.stdout.write(LogFormater(Message, "METRIC", LoggingColour.LEVEL.METRIC));
}
function LOG_INFO (Message) {
  process.stdout.write(LogFormater(Message, "INFO", LoggingColour.LEVEL.INFO));
}
function LOG_SYSTEM (Message) {
  process.stdout.write(LogFormater(Message, "SYSTEM", LoggingColour.LEVEL.SYSTEM));
}
function LOG_WARN (Message) {
  process.stdout.write(LogFormater(Message, "WARN", LoggingColour.LEVEL.WARN));
}
function LOG_ERROR (Message) {
  process.stdout.write(LogFormater(Message, "ERROR", LoggingColour.LEVEL.ERROR));
}
function LOG_SECUIRITY (Message) {
  process.stdout.write(LogFormater(Message, "SECURITY", LoggingColour.LEVEL.SECURITY));
}
function LOG_CRITICAL (Message) {
  process.stdout.write(LogFormater(Message, "CRITICAL", LoggingColour.LEVEL.CRITICAL));
}
function LOG_FATAL (Message) {
  process.stdout.write(LogFormater(Message, "FATAL", LoggingColour.LEVEL.FATAL));
}
function LOG_RAW (Message, Color = null) {
  var LOG;
  if (typeof Email !== 'object') {
    LOG = String(Message);
  } else {
    LOG = JSON.stringify(Message).replace(/:/g, ' : ').replace(/,/g, ' , ').replace(/{/, '{ ').replace(/}/, ' }');
  }

  if ( !Color ) {
    process.stdout.write(LOG);
  } else {
    const ColourCheck = /^#[A-Fa-f0-9]{6}$/;
    if ( !ColourCheck.test(Color) ) {
      LOG_CRITICAL ({ ERROR : "ERR-LOG:02", MESSAGE : "LOGGING COLOUR IS NOT CORRECT", PATH : "./" });
    } else {
      process.stdout.write(Chalk.hex(Color)(LOG));
    }
  }
}
/*- ==================================================================================================== -*/


/*- LOGGER EXPORTER -*/
/*- ==================================================================================================== -*/
const LOGGERS = {
  START : LOG_START,
  VERBOSE : LOG_VERBOSE,
  TRACE : LOG_TRACE,
  DEBUG : LOG_DEBUG,
  AUDIT : LOG_AUDIT,
  METRIC : LOG_METRIC,
  INFO : LOG_INFO,
  SYSTEM : LOG_SYSTEM,
  WARN : LOG_WARN,
  ERROR : LOG_ERROR,
  SECURITY : LOG_SECUIRITY,
  CRITICAL : LOG_CRITICAL,
  FATAL : LOG_FATAL,
  RAW : LOG_RAW,
};
export default LOGGERS;
/*- ==================================================================================================== -*/