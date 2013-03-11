jsdom = require './jsdom-with-xmlhttprequest'
createdb = require './createdb'

document = undefined
window = undefined

jsdom = jsdom.jsdom
express = require 'express'
fs = require 'fs'

db = require 'rethinkdb'

delay = (ms, func) -> setTimeout func, ms
interval = (ms, func) -> setInterval func, ms

express = require 'express'
app = express()

app.use express.static('public')

html = fs.readFileSync 'index.html', 'utf8'

app.get '/', (req, res, next) ->
  res.end html

products = fs.readFileSync 'public/products.html'

app.get '//products.html', (req, res, next) ->
  console.log 'sending //products'
  res.end products

getProducts = (req, res) ->
  if req.query.type is 'undefined'
    db.table('products').run().collect (products) ->
      res.end JSON.stringify(products)
  else
    db.table('products').filter({type: req.query.type}).run().collect (products) ->
      res.end JSON.stringify(products)

app.get '//products', (req, res, next) ->
  getProducts req, res

app.get '/products', (req, res, next) ->
  getProducts req, res

app.get "*", (req, res, next) ->
  console.log window.document.location
  e = window.document.getElementById 'mainctl'
  if window.angular?
    scope = window.angular.element(e).scope()
    scope.$apply ->
      scope.setLocation req.url
      return undefined
    delay 50, ->
      console.log window.document.innerHTML
      res.end window.document.innerHTML
  else
    console.log 'window.angular is not defined'
    console.log window.document.innerHTML

process.on 'uncaughtException', (err) ->
  console.log 'Uncaught exception:'
  console.log err
  console.log err.stack

db.connect { host: 'localhost', port: 28015 }, (conn) ->
  app.listen 3002
  console.log 'Listening on port 3002'
  document = jsdom html
  window = document.createWindow({localPrefix: 'http://localhost:3002/'})
