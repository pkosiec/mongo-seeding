#!/usr/bin/env node
'use strict';

const commandLineArgs = require('command-line-args');
const { optionsDefinition } = require('../dist/options');
const cli = require('../dist/index');

const options = commandLineArgs(optionsDefinition);
cli.run(options);
