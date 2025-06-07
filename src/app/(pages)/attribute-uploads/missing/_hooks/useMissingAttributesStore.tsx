import {
  useMissingAttributesCompanyStore,
  useMissingAttributesPersonStore,
} from 'src/store/attribute-uploads';

export const useMissingAttributesStore = (attributeType: 'person' | 'company') => {
  if (attributeType === 'person') {
    return useMissingAttributesPersonStore();
  } else {
    return useMissingAttributesCompanyStore();
  }
};
