/*
 *  lib/exec.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-12-15
 *
 *  Copyright [2013-2018] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const _ = require("iotdb-helpers")

const child_process = require("child_process");

/**
 *  Pop wrapper around child_process.exec
 */
const exec = _.promise.make((self, done) => {
    const method = "exec";

    assert.ok(_.is.String(self.command), `${method}: expected self.command to be String`);
    assert.ok(_.is.Dictionary(self.execd) || _.is.Nullish(self.execd), 
        `${method}: expected self.execd to be Dictionary or Null`);

    child_process.exec(self.command, self.execd || {}, (error, stdout, stderr) => {
        if (error) {
            return done(error);
        }

        self.document = stdout;
        self.document_stdout = stdout;
        self.document_stderr = stderr;

        done(null, self);
    });
})

/**
 *  Paramaterized
 */
const exec_p = (command, execd) => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add({
            command: command || self.command,
            execd: execd || self.execd || null,
        }))
        .then(exec)
        .then(_.promise.done(done, self, "document,document_stdout,document_stderr"))
        .catch(done)
})

/**
 *  API
 */
exports.exec = exec;
exports.exec.p = exec_p;
