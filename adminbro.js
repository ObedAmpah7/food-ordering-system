const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const express = require('express');
const app = express();

const adminBro = new AdminBro({
  databases: [],
  rootPath: '/admin',
});

const adminrouter = AdminBroExpress.buildRouter(adminBro);

app.use(adminBro.options.rootPath, router);
app.listen(8080, () => console.log('AdminBro is under localhost:8080/admin'));
AdminBro.registerAdapter(AdminBroMongoose);

const User = mongoose.model('User', { name: String, email: String, surname: String })

const run = async () => {
  await mongoose.connect('mongodb+srv://obed:pinocchio577@cluster0.263vx.mongodb.net/shop');
  const AdminBroOptions = {
    resources: [User],
  }
  const AdminBro = new AdminBro(AdminBroOptions);
};

run();