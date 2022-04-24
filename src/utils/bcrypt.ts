import * as bcrypt from 'bcrypt';

export function encodePassword(password: string) {
  const salt = bcrypt.genSaltSync();

  return bcrypt.hashSync(password, salt);
}

export function comparePasswords(rawPassword: string, hash: string) {
  return bcrypt.compareSync(rawPassword, hash);
}
