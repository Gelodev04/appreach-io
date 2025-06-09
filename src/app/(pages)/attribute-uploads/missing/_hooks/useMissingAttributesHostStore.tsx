import {
  useMissingCompanyAttributesFiltersStore,
  useMissingPersonAttributesFiltersStore,
} from 'src/store/attribute-uploads';

export const useMissingAttributesHostStore = (attributeType: 'person' | 'company') => {
  // Call both hooks unconditionally
  const personStore = useMissingPersonAttributesFiltersStore();
  const companyStore = useMissingCompanyAttributesFiltersStore();

  // Select the one to use based on the attributeType
  return attributeType === 'person' ? personStore : companyStore;
};
