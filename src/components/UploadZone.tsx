import { useRef, useState } from "react";
import { MAX_MB } from "../lib/validate";

export function UploadZone({ onFile, error }: { onFile: (f: File) => void; error: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={`flex flex-col items-center rounded-2xl border-2 border-dashed bg-white px-6 py-12 text-center transition ${drag ? "border-brand-500 bg-brand-50" : "border-slate-300"}`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl text-brand-600">⇪</div>
        <h2 className="mt-4 text-lg font-semibold">Drag & drop your website screenshot</h2>
        <p className="mt-1 text-sm text-slate-500">PNG, JPG or JPEG · up to {MAX_MB} MB</p>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="mt-5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Choose file
        </button>
        <input
          ref={input}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
