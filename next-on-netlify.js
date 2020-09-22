#!/usr/bin/env node
const { program } = require("commander");

program
  .option(
    "--max-log-lines [number]",
    "lines of build output to show for each section",
    50
  )
  .parse(process.argv);

const { logTitle } = require("./lib/helpers/logger");
const prepareFolders = require("./lib/steps/prepareFolders");
const copyPublicFiles = require("./lib/steps/copyPublicFiles");
const copyNextAssets = require("./lib/steps/copyNextAssets");
const setupSsrPages = require("./lib/steps/setupSsrPages");
const setupSsgPages = require("./lib/steps/setupSsgPages");
const setupHtmlPages = require("./lib/steps/setupHtmlPages");
const setupRedirects = require("./lib/steps/setupRedirects");

prepareFolders();

copyPublicFiles();

copyNextAssets();

setupSsrPages();

setupSsgPages();

setupHtmlPages();

setupRedirects();

logTitle("✅ Success! All done!");
