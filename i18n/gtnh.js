const fs = require("fs");
const http = require("http");

const argv = require('yargs')
    .demand([])
    .default({
        remote: "false",
        version: "1.5.0.7",
        input: null,
        output: "./"
    })
    .describe({
        remote: "If the script should get file from remote(Github)."
    })

    .boolean("remote")
    .alias("r", "remote")
    .alias("v", "version")
    .alias(["i", "input"], "inputfile")
    .alias(["o", "output"], "outputdir")

    .argv;

console.log(argv);