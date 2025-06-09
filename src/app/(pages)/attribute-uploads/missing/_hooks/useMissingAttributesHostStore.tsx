import {
  useMissingCompanyAttributesFiltersStore,
  useMissingPersonAttributesFiltersStore,
} from 'src/store/attribute-uploads';

export const useMissingAttributesHostStore = (attributeType: 'person' | 'company') => {
  return attributeType === 'person'
    ? useMissingPersonAttributesFiltersStore()
    : useMissingCompanyAttributesFiltersStore();
};
