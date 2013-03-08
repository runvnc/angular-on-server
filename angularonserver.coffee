jsdom = require('jsdom').jsdom
express = require 'express'
fs = require 'fs'

delay = (ms, func) -> setTimeout func, ms

express = require 'express'
app = express()

app.use express.static('public')

app.listen 3001
console.log 'Listening on port 3001'

html = fs.readFileSync 'public/index.html'
document = jsdom html
window = document.createWindow()

jsdom.jQueryify window, "http://localhost:3001/js/jquery.min.js", ->
  console.log window.document.innerHTML

app.get '/index.html', (req, res, next) ->
  res.end html

app.get "*", (req, res, next) ->
  console.log window.angular
  window.angular.element('body').scope()
  window.angular.injector(['ng']).invoke ($rootScope) ->
    scope = $rootScope.$new()
    scope.$location.path req.path
    delay 100, ->
      console.log window.document.innerHTML
      res.end window.document.innerHTML




