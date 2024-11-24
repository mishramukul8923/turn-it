import { hash } from 'bcryptjs';

export const hashPassword = async (password) => {
  return await hash(password, 12); // Hash the password with 12 rounds of salt
}; 
