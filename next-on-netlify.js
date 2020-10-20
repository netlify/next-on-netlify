#!/usr/bin/env node
const { program } = require("commander");

program
  .option(
    "--max-log-lines [number]",
    "lines of build output to show for each section",
    50
  )
  .parse(process.argv);

const nextOnNetlify = require("./index");
const { logTitle } = require("./lib/helpers/logger");

nextOnNetlify();

logTitle("✅ Success! All done!");
