#!/usr/bin/env node

const prepareFolders  = require('./lib/prepareFolders')
const copyPublicFiles = require('./lib/copyPublicFiles')
const copyNextAssets  = require('./lib/copyNextAssets')
const setupSsrPages   = require('./lib/setupSsrPages')
const setupSsgPages   = require('./lib/setupSsgPages')
const setupHtmlPages  = require('./lib/setupHtmlPages')
const setupRedirects  = require('./lib/setupRedirects')

prepareFolders()

copyPublicFiles()

copyNextAssets()

setupSsrPages()

setupSsgPages()

setupHtmlPages()

setupRedirects()

console.log("\x1b[1m✅ Success! All done!\x1b[22m")
