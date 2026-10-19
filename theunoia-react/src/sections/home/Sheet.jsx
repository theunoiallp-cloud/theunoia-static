/**
 * A hanging paper folder: a tab with the section's name, and the section inside.
 * The tilt and swing come from content/home/sheets.js (started by the Home page).
 */
export default function Sheet({ id, label, children }) {
  return (
    <>
      <div className="fs-mark" aria-hidden="true" />
      <div className="fs-sheet" data-fs={id}>
        <div className="fs-tab" aria-hidden="true">
          <svg viewBox="0 0 220 40" preserveAspectRatio="none"><path d="M0 40C20 40 22 2 44 2H176C198 2 200 40 220 40Z" /></svg>
          <span>{label}</span>
        </div>
        {children}
      </div>
    </>
  );
}
