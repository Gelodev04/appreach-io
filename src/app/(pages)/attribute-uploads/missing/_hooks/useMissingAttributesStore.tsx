import {
  useMissingAttributesCompanyStore,
  useMissingAttributesPersonStore,
} from 'src/store/attribute-uploads';

export const useMissingAttributesStore = (attributeType: 'person' | 'company') => {
  // Call both hooks unconditionally
  const personStore = useMissingAttributesPersonStore();
  const companyStore = useMissingAttributesCompanyStore();

  // Select the one to use based on the attributeType
  return attributeType === 'person' ? personStore : companyStore;
};
