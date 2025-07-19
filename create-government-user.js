const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/innovatex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: String,
  governmentInfo: {
    department: String,
  },
});

const User = mongoose.model('User', userSchema);

async function createGovernmentUser() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'gov@health.gov.in' });
    if (existingUser) {
      console.log('Government user already exists');
      return;
    }

    // Create password hash
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create government user
    const governmentUser = new User({
      name: 'Dr. Sarah Johnson',
      email: 'gov@health.gov.in',
      passwordHash: passwordHash,
      role: 'government',
      governmentInfo: {
        department: 'Ministry of Health & Family Welfare',
      },
    });

    await governmentUser.save();
    console.log('Government user created successfully');
    console.log('Email: gov@health.gov.in');
    console.log('Password: password123');
    console.log('Department: Ministry of Health & Family Welfare');
  } catch (error) {
    console.error('Error creating government user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createGovernmentUser(); 