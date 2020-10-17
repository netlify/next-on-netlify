#!/usr/bin/env node
const { program } = require("commander");

program
  .option(
    "--max-log-lines [number]",
    "lines of build output to show for each section",
    50
  )
  .option(
    "--with-trigger-functions",
    "Will parse functions that match Netlify Trigger Functions in 'pages/api/'"
  )
  .parse(process.argv);

const { logTitle } = require("./lib/helpers/logger");
const prepareFolders = require("./lib/steps/prepareFolders");
const copyPublicFiles = require("./lib/steps/copyPublicFiles");
const copyNextAssets = require("./lib/steps/copyNextAssets");
const setupPages = require("./lib/steps/setupPages");
const setupRedirects = require("./lib/steps/setupRedirects");

prepareFolders();

copyPublicFiles();

copyNextAssets();

setupPages();

setupRedirects();

logTitle("✅ Success! All done!");
