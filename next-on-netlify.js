#!/usr/bin/env node
const { program } = require("commander");

const nextOnNetlify = require("./index");
const { logTitle } = require("./lib/helpers/logger");

program.option(
  "--max-log-lines [number]",
  "lines of build output to show for each section",
  50
);

program
  .command("watch")
  .description("re-runs next-on-netlify on changes")
  .action(() => {
    nextOnNetlify({ watch: true });
  });

program
  .command("build", { isDefault: true })
  .description("runs next-on-netlify")
  .action(() => {
    nextOnNetlify();
    logTitle("✅ Success! All done!");
  });

program.parse(process.argv);
