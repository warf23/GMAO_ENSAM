
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Indicator {
  name: string;
  mtbf: string;
  mttr: string;
  trs: number | string;
}

type IndicateurTableProps = {
  indicators: Indicator[];
};

export function IndicateurTable({ indicators }: IndicateurTableProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Indicateurs de performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border rounded-lg shadow text-sm mt-2">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-semibold">Équipement</th>
                <th className="p-3 text-left font-semibold">MTBF (h)</th>
                <th className="p-3 text-left font-semibold">MTTR (h)</th>
                <th className="p-3 text-left font-semibold">TRS (%)</th>
              </tr>
            </thead>
            <tbody>
              {indicators.map(ind => (
                <tr className="border-b" key={ind.name}>
                  <td className="px-3 py-2">{ind.name}</td>
                  <td className="px-3 py-2">{ind.mtbf}</td>
                  <td className="px-3 py-2">{ind.mttr}</td>
                  <td className="px-3 py-2">{ind.trs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
