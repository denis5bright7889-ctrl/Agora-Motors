const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://autoagora_user:SecurePassword123@cluster0.caeptry.mongodb.net/agora_motors';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED:', err.message);
    process.exit(1);
  });
