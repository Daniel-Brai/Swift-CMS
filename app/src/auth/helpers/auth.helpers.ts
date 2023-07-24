import * as argon from 'argon2';

export async function hash(str: string): Promise<string> {
  try {
    return await argon.hash(str);
  } catch (e) {
    throw new Error(`${e.msg}`);
  }
}

export async function verify(
  hashed_str: string,
  str: string,
): Promise<boolean> {
  try {
    return await argon.verify(hashed_str, str);
  } catch (e) {
    throw new Error(`${e.msg}`);
  }
}
