type hostUserSettings = {
  userSettings: {
    externalSenderAddresses: string[];
  } | null;
  id: string;
};

type AddressType = {
  hostsData: hostUserSettings[];
  externalSenderAddressesArray: string[];
};

export function generateArrayAddresses(addressList: string): string[] {
  const arrayList = addressList.split('\n');
  const filtered = arrayList.filter((add: string) => add.trim() !== '');

  return filtered;
}

export const retrieveDuplicateAddresses = ({
  hostsData,
  externalSenderAddressesArray,
}: AddressType): string[] => {
  const duplicateAddresses: string[] = []; // Array to store all duplicates

  // Loop through all hosts data
  hostsData.forEach((host) => {
    const allAddresses = host.userSettings?.externalSenderAddresses || [];

    // Loop through each address in the current host
    allAddresses.forEach((usersAddress) => {
      // Check if the address exists in externalSenderAddressesArray and not already in duplicates
      if (
        externalSenderAddressesArray.some((externalAddress) =>
          usersAddress.includes(externalAddress)
        ) &&
        !duplicateAddresses.includes(usersAddress)
      ) {
        duplicateAddresses.push(usersAddress);
      }
    });
  });

  return duplicateAddresses;
};
