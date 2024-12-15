const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connecting to', url)


mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')

  })

  .catch(error => {
    console.log('error connecting to MongoDB', error.message)

  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3, // Name must be at least 3 characters long
    required: true, // Name is required
  },
  number: {
    type: String,
    required: true, // Phone number is required
    validate: {
      validator: function (value) {
        // Custom validation for phone number format
        return /^(\d{2,3})-\d{5,}$/.test(value)
      },
      message: props => `${props.value} is not a valid phone number! Format should be "xx-xxxxx" or "xxx-xxxxxx".`,
    },
  },
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('person', personSchema)