import type { DepartmentColor } from "./types";
import { COLOR_MAP } from "./types";

interface ColorPickerProps {
  value: DepartmentColor;
  onChange: (color: DepartmentColor) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const colors = Object.keys(COLOR_MAP) as DepartmentColor[];

  return (
    <div className="flex items-center gap-2.5">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`w-8 h-8 rounded-lg transition-all ${COLOR_MAP[color].dot} ${
            value === color ? `ring-2 ring-offset-2 ${COLOR_MAP[color].ring} scale-110` : "hover:scale-105"
          }`}
        />
      ))}
    </div>
  );
}