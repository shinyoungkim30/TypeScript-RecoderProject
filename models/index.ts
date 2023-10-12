import Sequelize from 'sequelize';
import configObj from '../config/config';
import User from './user';
import Company from './company'
import Client from './client'
import Warehouse from './warehouse'
import Rack from './rack'
import Loading from './loading'
import Notice from './notice'
import Stock from './stock'

const env = process.env.NODE_ENV as 'production' | 'test' || 'development';
const config = configObj[env];

export const sequelize = new Sequelize.Sequelize(
  config.database!, config.username!, config.password, config,
)

User.initiate(sequelize);
Company.initiate(sequelize);
Client.initiate(sequelize);
Warehouse.initiate(sequelize);
Rack.initiate(sequelize);
Loading.initiate(sequelize);
Notice.initiate(sequelize);
Stock.initiate(sequelize);

User.associate();
Company.associate();
Client.associate();
Warehouse.associate();
Rack.associate();
Loading.associate();
Notice.associate();
Stock.associate();

export { User, Company, Client, Warehouse, Rack, Loading, Notice, Stock };