db = require 'rethinkdb'

db.connect { host: 'localhost', port: 28015 }, (conn) ->
  db.db('test').tableCreate('products').run()
  db.db('test').table('products').del().run()
  db.db('test').table('products').insert({type: 'outdoor', name: 'Deck Set', price: 189.95}).run()
  db.db('test').table('products').insert({type: 'outdoor', name: 'Patio Set', price: 259.95}).run()
  db.db('test').table('products').insert({type: 'electronics', name: 'iPhone 12', price: 899.95}).run()
  db.db('test').table('products').insert({type: 'electronics', name: 'Chromebook', price: 259.95}).run()

