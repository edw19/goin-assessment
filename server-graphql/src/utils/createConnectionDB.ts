import { mongoose } from "@typegoose/typegoose";

// db in mongodb atlas for tests
const URl_MONGODB =
  "mongodb://ecommerce:VnlyYhymWWT2128q@cluster0-shard-00-00.mqoho.mongodb.net:27017,cluster0-shard-00-01.mqoho.mongodb.net:27017,cluster0-shard-00-02.mqoho.mongodb.net:27017/ecommerce?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
  
export async function createConnectionDB() {
  await mongoose.connect(URl_MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}
