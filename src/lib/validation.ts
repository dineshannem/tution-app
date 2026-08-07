export const onlyNumbers = (value: string, maxLength = 10) => {
  return value.replace(/\D/g, '').slice(0, maxLength);
};

export const isValidIndianPhone = (phone: string) => {
  return /^[6-9]\d{9}$/.test(phone);
};

/*import { onlyNumbers } from '../../lib/validation';

<input
  type="tel"
  value={phone}
  onChange={(e) => setPhone(onlyNumbers(e.target.value))}
  maxLength={10}
  placeholder="9876543210"
/>*/
