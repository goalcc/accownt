import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';

export async function emailToId(
  email: Accownt.User['email']
): Promise<Accownt.User['id']> {
  await storage.init(STORAGE);
  const userId: Accownt.User['id'] = await storage.getItem(`email-${email}`);
  if (userId === undefined) throw 'User with email does not exist';
  return userId;
}
