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

const createMissingAttributesStore = () =>
  create<MissingAttributesState>((set) => ({
    unsaved: {},
    editedValues: {},
    savedValues: {},
    setFieldValue: (rowId, field, value) =>
      set((state) => {
        const savedValue = state.savedValues[rowId]?.[field] ?? '';

        const isSameAsSaved = value === savedValue;

        const newEditedValues = {
          ...state.editedValues,
          [rowId]: { ...(state.editedValues[rowId] || {}), [field]: value },
        };

        if (isSameAsSaved) {
          const updatedRow = { ...(state.unsaved[rowId] || {}) };
          delete updatedRow[field];

          const newUnsaved = { ...state.unsaved };
          if (Object.keys(updatedRow).length === 0) {
            delete newUnsaved[rowId];
          } else {
            newUnsaved[rowId] = updatedRow;
          }

          return {
            unsaved: newUnsaved,
            editedValues: newEditedValues,
          };
        }

        // Mark as unsaved
        return {
          unsaved: {
            ...state.unsaved,
            [rowId]: { ...(state.unsaved[rowId] || {}), [field]: value },
          },
          editedValues: newEditedValues,
        };
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
        return {
          savedValues: {
            ...state.savedValues,
            [rowId]: {
              ...(state.savedValues[rowId] || {}),
              ...updatedFields,
            },
          },
        };
      }),
  }));

export const useMissingAttributesPersonStore = createMissingAttributesStore();
export const useMissingAttributesCompanyStore = createMissingAttributesStore();

export const useMissingPersonAttributesFiltersStore = create<MissingAttributesFiltersState>(
  (set) => ({
    hostName: '',
    setHostName: (hostName) => set({ hostName }),
    clearFilters: () => set({ hostName: '' }),
  })
);

export const useMissingCompanyAttributesFiltersStore = create<MissingAttributesFiltersState>(
  (set) => ({
    hostName: '',
    setHostName: (hostName) => set({ hostName }),
    clearFilters: () => set({ hostName: '' }),
  })
);
