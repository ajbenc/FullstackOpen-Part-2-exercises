import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters']
  },
  phoneNumbers: {
    type: [String],
    required: true,
    validate: {
      validator: function(numbers) {
        return numbers.length > 0;
      },
      message: 'At least one phone number is required'
    }
  }
});

export default mongoose.model('Person', personSchema);