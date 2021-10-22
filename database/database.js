const Datastore = require('nedb')

const requestStore = new Datastore("database/requestStore.db")
const bookStore = new Datastore("database/bookStore.db")
const profileStore = new Datastore("database/profileStore.db")

requestStore.loadDatabase()
bookStore.loadDatabase()
profileStore.loadDatabase()

// module.exports = requestStore
// module.exports = bookStore
// module.exports = profileStore
module.exports = { requestStore, bookStore, profileStore }