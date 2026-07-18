import { Check, Plus, X } from 'lucide-react';

interface FormActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  createLabel: string;
  updateLabel?: string;
  onCancel: () => void;
}

export function FormActions({ isEditing, isSaving, createLabel, updateLabel = 'Guardar cambios', onCancel }: FormActionsProps) {
  return (
    <div className="form-actions">
      <button type="submit" className="button button-primary" disabled={isSaving}>
        {isEditing ? <Check size={19} /> : <Plus size={19} />}
        {isSaving ? 'Guardando...' : isEditing ? updateLabel : createLabel}
      </button>
      {isEditing && (
        <button type="button" className="button button-quiet" onClick={onCancel} disabled={isSaving}>
          <X size={19} /> Cancelar
        </button>
      )}
    </div>
  );
}
