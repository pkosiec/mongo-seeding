#!/usr/bin/env node
'use strict';

require('ts-node').register();

const { cliSeeder } = require('../dist/index');
cliSeeder.run();
