interface StatusNoticeProps {
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage: string;
  onRetry?: () => void;
}

export function StatusNotice({ loading, error, empty, emptyMessage, onRetry }: StatusNoticeProps) {
  if (loading) return <p className="status-notice" aria-live="polite">Cargando biblioteca...</p>;
  if (error) {
    return (
      <div className="status-notice status-error" role="alert">
        <p>{error}</p>
        {onRetry && <button type="button" className="button button-quiet" onClick={onRetry}>Reintentar</button>}
      </div>
    );
  }
  if (empty) return <p className="status-notice">{emptyMessage}</p>;
  return null;
}
