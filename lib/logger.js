// Helpers for writing info to console.log

// Format in bold
const logTitle = (...args) =>
  log(`\x1b[1m${args.join(" ")}\x1b[22m`)

// Indent by three spaces
const logItem = (...args) =>
  log('  ', ...args)

// Just console.log
const log = (...args) =>
  console.log(...args)

module.exports = {
  logTitle,
  logItem,
  log
}
