import React from "react";
import KimpTable from "@/components/kimp/kimp-table";
import { Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function KimpPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Zap className="w-10 h-10 text-primary fill-primary/10" /> 김치 프리미엄
            </h1>
            <p className="text-muted-foreground text-lg">
              비교 거래소: 업비트(KRW) vs. 바이낸스 (USD)
            </p>
          </div>
        </div>

        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle>코인+토큰 시장 요약</CardTitle>
            <CardDescription>
              BTC, ETH를 포함한 주요 자산들의 김프 현황. 갱신주기는 1시간.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <KimpTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
