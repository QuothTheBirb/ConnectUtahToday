import {CollectionBeforeChangeHook} from 'payload'
import {relativeExpireDate} from "@/lib/relativeExpireDate";

export const calculateExpiry: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  if (operation !== 'create') return data;

  if (data.expiresIn !== 'date') {
    const expiresAtDate = relativeExpireDate(data.expiresIn)

    data.expirationDate = expiresAtDate.toISOString();
  }

  return data;
}
