import mongoose from 'mongoose';
// @ts-ignore
import bcrypt from 'bcrypt';

const saltRounds = 10; // bcrypt 的盐值设定
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const cached: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> } = {};
async function connectMongo() {
  if (!MONGO_URI || !ADMIN_PASSWORD) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
  }
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts);
  }
  try {
    cached.connection = await cached.promise;
    // 检查数据库中是否已有密码
    const adminCollection = mongoose.connection.db.collection('admin');
    const admin = await adminCollection.findOne();
    if (!admin || !admin.password) {
      // 如果数据库中没有密码，设置密码
      // 如果数据库中没有密码，设置密码
      console.log('Setting default admin password');
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds); // 加密密码
      if (!admin) {
        // 如果没有admin文档，则创建一个
        await adminCollection.insertOne({ password: hashedPassword });
      } else {
        // 如果有admin文档但没有密码字段，更新文档添加密码字段
        await adminCollection.updateOne({ _id: admin._id }, { $set: { password: hashedPassword } });
      }
    }

    console.log('connect success!')
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}
export default connectMongo;
