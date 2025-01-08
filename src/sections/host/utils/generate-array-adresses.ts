export function generateArrayAddresses(addressList: string): string[] {
  const arrayList = addressList.split('\n');
  const filtered = arrayList.filter((add: string) => add.trim() !== '');

  return filtered;
}
