import { z } from 'zod';

export function zodEnumWithMessage<E extends Record<string, string>>(
  enumObj: E,
  message: string
) {
  return z.nativeEnum(enumObj).refine(
    (val) => Object.values(enumObj).includes(val),
    { message }
  );
}
