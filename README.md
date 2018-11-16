# wizardy-brewery

Some randomly named tool that does things like generating boilerplate code. Currently not really useful for anyone except me.

# Usage

First you need to create a json config file, let's call it `brewery.json`

Here you first define an application id and an entry point.
An application ide should be [a-zA-Z0-9-]
The entry point is simply the module that the pregenerated js file will call after all modules are processed

Example: `{"id": "myApp"}`

Now you can add plugins by simply using the plugin name as key in the json

If you need multiple entrypoints you can simply define an array `modules` with properties that override the global ones on a per-module basis

Example: `{"standard": true, "modules": [{"id": "app-1", "entry": "app-1.js"}, {"id": "app-2", "entry": "app-2.js"}]}`

Every plugin defines environment variables, you can use them in strings (but they don't get added to your application's environment)

Later you simply need to run `wizardy-brewery $PWD/brewery.json`

# Plugins

## version

Version managment module

This module
- Sets the environment variables
  - `VERSION`: package.json version
  - `REVISION`: number of commits
  - `COMMIT`: 6-char commit id
  - `COMPILE_TIME`: current time in seconds
  - `TAG`: Version tag based on `version.format`
- Accepts the option `version.format`
  - This is later going to be used as the actual version
  - Example: `v$VERSIONr$REVISION@$COMMIT`
- Sets `process.moduleVersion` to `{revision: "number of commits", commit: "6-char commit id", comipleTime: "current time"}`
- Provides `out.version`

## env

Environment variable manipulation module (for the application)

This module
- Accepts an object where the value of each key can either be falsy or a string
  - Falsy values represent environment variables to delete (e.g. `DEBUG`)
  - String values represent environment variables to set (e.g. `NODE_ENV: "production"`)
- NOTE: This overrides current variables

## startupPrint

Print text before application entrypoint is loaded

This module
- Accepts an array of strings, all env vars in those strings get replaced and added as `console.log` calls

## sentry

Add sentry to your app

This module
- Accepts an object which is going to be passed as-is to sentry.init
- Also adds an error script that catches fatal errors

## eFlag

Add an error flag/clean shutdown flag

This module
- Accepts a boolean
- Adds the `eFlag.get()` function in the startup code so modules can perform recovery routines in case a fatal crash has occured previously

## standard

Standard formatter integration

This module
- Accepts a boolean
- Runs `standard --fix` (failures and errors are ignored) on the output js files

## pkg

pkg bundeling

This module
- Accepts an object with cli-properties for pkg
- Bundles all files using pkg
- Provides `out.bundle`

## pneumon

Pneumon distribution

This module
- Accepts a string `pneumon.ota` containing `@FILE` which is later going to be replaced by the code to get the appropriate json metadata (example: set it to `https://your-ota-server.com/@FILE.json`)
- All other properties get passed to pneumon as-is (except name which gets overriden with the id)
- Writes pneumon metadata
- Required `out.bundle` and `out.version`
