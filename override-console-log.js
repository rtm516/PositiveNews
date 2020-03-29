/*
Author: Shammi Hans | Smi0001
Dependency: JavaScript (ES06)
Description: Overriding console.log to customize the log with current time along with passed log arguments
*/

const origlog = console.log

const defaultOptions = Object.freeze(
  {
    logDate: true,
    logDateFormat: 'toLocaleString', // Date format is actually the format-function-name in which user wants to convert the date
    enableAll: true,
    enableLog: true,
    enableLogI: true,
    enableLogD: true,
    enableLogE: true,
    logCustomPrefix: '', // accepts any string of length < 1000
    logDateThenPrefix: true,
    debugPrefix: 'DEBUG',
    infoPrefix: 'INFO',
    errorPrefix: 'ERROR',
    stopLogging: false // stop this logging with format, only console.log() & log() can be used as usual logging
  }
)
let logConfig = {}
console.resetLogger = function () {
  logConfig = JSON.parse(JSON.stringify(defaultOptions))
}
console.resetLogger()

function formatAMPM (date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ampm
  return strTime
}

const getCurrentDateFormat = function () {
  var now = new Date()
  var dateStr = now.toLocaleDateString() + ' ' + formatAMPM(now) // default date format
  if (logConfig && logConfig.logDateFormat && typeof logConfig.logDateFormat === 'string') {
    switch (logConfig.logDateFormat.toLowerCase()) {
      case 'todatestring':
        dateStr = (new Date()).toDateString()
        break
      case 'togmtstring':
        dateStr = (new Date()).toGMTString()
        break
      case 'toisostring':
        dateStr = (new Date()).toISOString()
        break
      case 'tojson':
        dateStr = (new Date()).toJSON()
        break
      case 'tolocaledatestring':
        dateStr = (new Date()).toLocaleDateString()
        break
      case 'tostring':
        dateStr = (new Date()).toString()
        break
      case 'totimestring':
        dateStr = (new Date()).toTimeString()
        break
      case 'toutcstring':
        dateStr = (new Date()).toUTCString()
        break
      default:
        // dateStr = (new Date()).toLocaleString();
        break
    }
  }
  return dateStr
}

console.log = function (obj, ...argumentArray) {
  var dateString = ''
  var datePrefix = ''
  if (logConfig && !logConfig.stopLogging) {
    if (logConfig && logConfig.enableAll && logConfig.enableLog && logConfig.logDate) {
      dateString = getCurrentDateFormat()
      datePrefix = '[' + dateString + '] '
    }
  }
  if (typeof obj === 'string') {
    argumentArray.unshift(datePrefix + obj)
  } else {
    // This handles console.log( object )
    argumentArray.unshift(obj)
    argumentArray.unshift(datePrefix)
  }
  origlog.apply(this, argumentArray)
}

const getDatePrefix = function (prefix) {
  var datePrefix = ''
  var dateString = ''
  if (logConfig && logConfig.enableAll) {
    if (logConfig.logDate) {
      dateString = getCurrentDateFormat()
    }
    datePrefix = logConfig.logDateThenPrefix ? (dateString + prefix + ' ') : (prefix + ' ' + dateString)
  }
  return datePrefix + ' '
}

console.logD = function (obj, ...argumentArray) {
  if (logConfig && !logConfig.stopLogging) {
    var dateString = getCurrentDateFormat()
    var datePrefix = '[' + dateString + ' ' + logConfig.debugPrefix + '] '

    if (typeof obj === 'string') {
      argumentArray.unshift(datePrefix + obj)
    } else {
      argumentArray.unshift(obj)
      argumentArray.unshift(datePrefix)
    }
    origlog.apply(this, argumentArray)
  }
}

console.logI = function (obj, ...argumentArray) {
  if (logConfig && !logConfig.stopLogging) {
    var dateString = getCurrentDateFormat()
    var datePrefix = '[' + dateString + ' ' + logConfig.infoPrefix + '] '

    if (typeof obj === 'string') {
      argumentArray.unshift(datePrefix + obj)
    } else {
      argumentArray.unshift(obj)
      argumentArray.unshift(datePrefix)
    }
    origlog.apply(this, argumentArray)
  }
}

console.logE = function (obj, ...argumentArray) {
  if (logConfig && !logConfig.stopLogging) {
    var dateString = getCurrentDateFormat()
    var datePrefix = '[' + dateString + ' ' + logConfig.errorPrefix + '] '

    if (typeof obj === 'string') {
      argumentArray.unshift(datePrefix + obj)
    } else {
      // This handles console.log( object )
      argumentArray.unshift(obj)
      argumentArray.unshift(datePrefix)
    }
    origlog.apply(this, argumentArray)
  }
}

module.exports.log = console.log
module.exports.logI = console.logI
module.exports.logD = console.logD
module.exports.logE = console.logE
module.exports.logConfig = logConfig
module.exports.resetLogger = console.resetLogger
