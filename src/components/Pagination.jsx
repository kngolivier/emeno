// FILE: src/components/Pagination.jsx

export const Pagination = ({ meta, setPage }) => {
  if (!meta) return null;

  const current = meta.page;
  const total   = meta.pages;

  const getPages = () => {
    const delta = 2;
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift("...");
    if (current + delta < total - 1) range.push("...");

    range.unshift(1);
    if (total > 1) range.push(total);

    return range;
  };

  const pages = getPages();

  const baseBtn =
    "px-3 py-1.5 text-sm rounded-xl border transition font-medium";

  const activeBtn =
    "bg-primary text-white border-primary shadow-sm";

  const inactiveBtn =
    "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";

  const disabledBtn =
    "opacity-40 cursor-not-allowed";

  return (
    <div className="flex items-center justify-between mt-6">

      {/* LEFT INFO */}
      <div className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-700">{current}</span> / {total}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-2 bg-white border rounded-2xl px-2 py-2 shadow-sm">

        {/* PREV */}
        <button
          disabled={current === 1}
          onClick={() => setPage(current - 1)}
          className={`${baseBtn} ${
            current === 1 ? disabledBtn : inactiveBtn
          }`}
        >
          Prev
        </button>

        {/* PAGES */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`${baseBtn} ${
                p === current ? activeBtn : inactiveBtn
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          disabled={current === total}
          onClick={() => setPage(current + 1)}
          className={`${baseBtn} ${
            current === total ? disabledBtn : inactiveBtn
          }`}
        >
          Next
        </button>

      </div>
    </div>
  );
};