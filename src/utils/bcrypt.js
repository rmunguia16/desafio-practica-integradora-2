
import bcrypt from 'bcrypt';

export const createHash =  (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS)));

export const validatePassword = (sendPassword, dbPassword) => bcrypt.compareSync(sendPassword, dbPassword);