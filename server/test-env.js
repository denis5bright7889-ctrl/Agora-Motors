require('dotenv').config();
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not found in .env file!');
    console.log('Current directory:', process.cwd());
    console.log('.env file path:', require('path').join(process.cwd(), '.env'));
}
