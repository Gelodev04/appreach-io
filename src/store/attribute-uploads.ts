import { create } from 'zustand';

type FieldUpdates = Record<string, string>;

type MissingAttributesState = {
  unsaved: Record<string, FieldUpdates>;
  editedValues: Record<string, FieldUpdates>;
  savedValues: Record<string, FieldUpdates>;
  setFieldValue: (rowId: string, field: string, value: string, originalValue: string) => void;
  clearRowChanges: (rowId: string) => void;
  clearFieldChange: (rowId: string, field: string) => void;
  setEditedValue: (rowId: string, field: string, value: string) => void;
  resetEditedValues: (rowId: string) => void;
  updateSavedValues: (rowId: string, updatedFields: FieldUpdates) => void;
};

interface MissingAttributesFiltersState {
  hostName: string;
  setHostName: (hostName: string) => void;
  clearFilters: () => void;
}

export const useMissingAttributesFieldStore = create<MissingAttributesState>((set) => ({
  unsaved: {},
  editedValues: {},
  savedValues: {},
  setFieldValue: (rowId, field, value, originalValue) =>
    set((state) => {
      const isChanged = String(value).trim() !== String(originalValue).trim();

      const updatedRowUnsaved = { ...(state.unsaved[rowId] || {}) };

      if (isChanged) {
        // If it's changed, add/update it in the unsaved changes
        updatedRowUnsaved[field] = value;
      } else {
        // If it's NOT changed (i.e., reverted to original), remove it from unsaved
        delete updatedRowUnsaved[field];
      }

      const newUnsaved = { ...state.unsaved };
      if (Object.keys(updatedRowUnsaved).length === 0) {
        // If the row has no more unsaved changes, remove the row object itself for cleanliness
        delete newUnsaved[rowId];
      } else {
        newUnsaved[rowId] = updatedRowUnsaved;
      }

      // Only return the updated 'unsaved' state.
      return { unsaved: newUnsaved };
    }),

  clearRowChanges: (rowId) =>
    set((state) => {
      const { [rowId]: _, ...restUnsaved } = state.unsaved;
      // Optionally reset editedValues on row clear or keep as is (you can tweak)
      // Let's keep editedValues as is so UI reflects saved values.
      return { unsaved: restUnsaved };
    }),

  clearFieldChange: (rowId, field) =>
    set((state) => {
      const updatedRow = { ...(state.unsaved[rowId] || {}) };
      delete updatedRow[field];

      const newUnsaved = { ...state.unsaved };
      if (Object.keys(updatedRow).length === 0) {
        delete newUnsaved[rowId];
      } else {
        newUnsaved[rowId] = updatedRow;
      }

      return { unsaved: newUnsaved };
    }),

  setEditedValue: (rowId, field, value) =>
    set((state) => ({
      editedValues: {
        ...state.editedValues,
        [rowId]: { ...(state.editedValues[rowId] || {}), [field]: value },
      },
    })),

  resetEditedValues: (rowId) =>
    set((state) => {
      const newEditedValues = { ...state.editedValues };
      delete newEditedValues[rowId];
      return { editedValues: newEditedValues };
    }),

  updateSavedValues: (rowId, updatedFields) =>
    set((state) => {
      const newEditedValues = {
        ...state.editedValues,
        [rowId]: {
          ...(state.editedValues[rowId] || {}),
          ...updatedFields,
        },
      };

      const newSavedValues = {
        ...state.savedValues,
        [rowId]: {
          ...(state.savedValues[rowId] || {}),
          ...updatedFields,
        },
      };

      return {
        savedValues: newSavedValues,
        editedValues: newEditedValues,
      };
    }),
}));

export const useMissingAttributesFiltersStore = create<MissingAttributesFiltersState>((set) => ({
  hostName: '',
  setHostName: (hostName) => set({ hostName }),
  clearFilters: () => set({ hostName: '' }),
}));
