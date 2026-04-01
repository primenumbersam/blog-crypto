"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SparklineChart from "@/components/charts/sparkline-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, Info, ChevronUp, ChevronDown, ArrowUpDown, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { KIMP_MAPPING, KimpSymbol } from "@/lib/kimp-constants";
import Link from "next/link";
import TradingViewRowWidget from "@/components/charts/tradingview-row-widget";

interface KimpItem {
  symbol: string;
  upbitPrice: number;
  binancePrice: number;
  kimp: number;
  change24h: number;
  high52: number;
  low52: number;
  high52Diff: number;
  low52Diff: number;
  sparkline: number[];
}

type SortField = "symbol" | "upbitPrice" | "binancePrice" | "kimp" | "change24h" | "high52Diff" | "low52Diff";
type SortOrder = "asc" | "desc" | null;

export default function KimpTable() {
  const [data, setData] = useState<KimpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [sortField, setSortField] = useState<SortField | null>("upbitPrice");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/kimp");
        const json = await res.json();
        if (json.data) {
          setData(json.data);
          setExchangeRate(json.rate);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "desc") {
        setSortOrder("asc");
      } else if (sortOrder === "asc") {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortOrder("desc");
      }
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const toggleExpand = (symbol: string) => {
    setExpandedRow(expandedRow === symbol ? null : symbol);
  };

  const sortedData = useMemo(() => {
    if (!sortField || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      const modifier = sortOrder === "asc" ? 1 : -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * modifier;
      }

      return ((aVal as number) - (bVal as number)) * modifier;
    });
  }, [data, sortField, sortOrder]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(13)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30" />;
    return sortOrder === "desc" ? <ChevronDown className="ml-1 h-3 w-3 text-primary" /> : <ChevronUp className="ml-1 h-3 w-3 text-primary" />;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex mb-4 text-[10px] md:text-xs text-muted-foreground items-center gap-2 px-1">
        <Info className="w-3 h-3" /> 적용 환율: 1 USD = {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 0 })} KRW
      </div>
      <div className="rounded-xl bg-card/50 overflow-hidden min-w-[350px]">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead
                className="w-[100px] md:w-[180px] pl-4 md:pl-6 font-bold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("symbol")}
              >
                <div className="flex items-center">
                  자산명 <SortIcon field="symbol" />
                </div>
              </TableHead>
              <TableHead
                className="text-right font-bold cursor-pointer hover:bg-muted/80 transition-colors px-2"
                onClick={() => handleSort("upbitPrice")}
              >
                <div className="flex items-center justify-end">
                  현재가 (KRW) <SortIcon field="upbitPrice" />
                </div>
              </TableHead>
              <TableHead
                className="hidden lg:table-cell text-right font-bold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("binancePrice")}
              >
                <div className="flex items-center justify-end">
                  현재가 (USD) <SortIcon field="binancePrice" />
                </div>
              </TableHead>
              <TableHead
                className="text-right font-bold cursor-pointer hover:bg-muted/80 transition-colors px-2"
                onClick={() => handleSort("kimp")}
              >
                <div className="flex items-center justify-end">
                  김프 (%) <SortIcon field="kimp" />
                </div>
              </TableHead>
              <TableHead
                className="text-center font-bold cursor-pointer hover:bg-muted/80 transition-colors px-2"
                onClick={() => handleSort("change24h")}
              >
                <div className="flex items-center justify-center">
                  지난 24h(%) <SortIcon field="change24h" />
                </div>
              </TableHead>
              <TableHead
                className="hidden md:table-cell text-right font-bold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("high52Diff")}
              >
                <div className="flex items-center justify-end">
                  지난 52주 고점(%) <SortIcon field="high52Diff" />
                </div>
              </TableHead>
              <TableHead
                className="hidden md:table-cell text-right font-bold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("low52Diff")}
              >
                <div className="flex items-center justify-end">
                  지난 52주 저점(%) <SortIcon field="low52Diff" />
                </div>
              </TableHead>
              <TableHead className="hidden sm:table-cell text-center font-bold pr-4 md:pr-6">지난 1M SparkLine</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => {
              const mapping = KIMP_MAPPING[item.symbol as KimpSymbol];
              const isExpanded = expandedRow === item.symbol;

              return (
                <React.Fragment key={item.symbol}>
                  <TableRow className={`hover:bg-muted/30 transition-colors h-14 md:h-16 ${isExpanded ? 'bg-muted/10' : ''}`}>
                    <TableCell className="font-bold pl-4 md:pl-6 text-xs md:text-sm">
                      <button
                        onClick={() => toggleExpand(item.symbol)}
                        className="hover:text-primary transition-colors flex items-center text-left gap-2 group"
                      >
                        <ChevronRight
                          size={14}
                          className={`text-muted-foreground/50 group-hover:text-primary transition-transform duration-200 ${isExpanded ? 'rotate-90 text-primary' : ''}`}
                        />
                        <div className="flex flex-col md:flex-row md:items-center">
                          <span>{item.symbol}</span>
                          <span className="text-[10px] font-normal text-muted-foreground md:ml-1 md:text-xs">
                            {mapping?.nameKo ? `(${mapping.nameKo})` : ""}
                          </span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-xs md:text-sm px-2">
                      {item.upbitPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right font-mono text-muted-foreground text-xs md:text-sm">
                      ${item.binancePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={`text-center font-bold text-xs md:text-sm px-2 ${item.kimp > 0 ? 'text-green-500' : item.kimp < 0 ? 'text-red-500' : ''}`}>
                      {item.kimp > 0 ? '+' : ''}{item.kimp.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-center px-2">
                      <div className={`flex items-center justify-center gap-1 font-semibold text-xs md:text-sm ${item.change24h > 0 ? 'text-green-500' : item.change24h < 0 ? 'text-red-500' : ''}`}>
                        {item.change24h > 0 ? <TrendingUp size={12} /> : item.change24h < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                        {item.change24h > 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center px-2">
                      <span className="text-sm font-semibold text-red-500">{item.high52Diff.toFixed(2)}%</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center px-2">
                      <span className="text-sm font-semibold text-green-500">+{item.low52Diff.toFixed(2)}%</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-2 pr-4 md:pr-6">
                      <div className="flex justify-center h-full items-center">
                        {(() => {
                          const isUp = item.sparkline.length > 1 && item.sparkline[item.sparkline.length - 1] >= item.sparkline[0];
                          return (
                            <SparklineChart
                              data={item.sparkline}
                              color={isUp ? '#22c55e' : '#ef4444'}
                            />
                          );
                        })()}
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-muted/5 hover:bg-muted/5">
                      <TableCell colSpan={8} className="p-0 border-b-0">
                        <TradingViewRowWidget symbol={mapping.binance} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
