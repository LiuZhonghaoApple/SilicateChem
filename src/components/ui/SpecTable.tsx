import type { ProductSpec } from "@/types";

export function SpecTable({ specs }: { specs: ProductSpec[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#E2E6EA]">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, i) => (
            <tr
              key={spec.label}
              className={i % 2 === 0 ? "bg-white" : "bg-[#F4F6F8]"}
            >
              <td className="px-4 py-3 font-semibold text-[#0B2D5B] whitespace-nowrap w-1/3">
                {spec.label}
              </td>
              <td className="px-4 py-3 text-[#5A6570]">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
