import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface CountryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName: string;
}

interface CountryDetailData {
  country: string;
  current: number;
  currentYear: number;
  average15Year: number;
  changeVs2008: number;
  rank: number;
  dataPoints: number;
  firstYear: number;
  lastUpdated: number;
  trendData: { year: number; value: number }[];
}

export function CountryDetailModal({ isOpen, onClose, countryName }: CountryDetailModalProps) {
  // Fetch detailed country data
  const { data: countryDetail, isLoading } = useQuery<CountryDetailData>({
    queryKey: ['/api/country-detail', countryName],
    enabled: isOpen && !!countryName,
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{countryName}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading country data...</div>
          </div>
        ) : countryDetail ? (
          <div className="space-y-6">
            {/* Subtitle */}
            <p className="text-muted-foreground">Renewable Electricity Trend</p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Current</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {countryDetail.current.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">{countryDetail.currentYear}</div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">15-Year Avg</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {countryDetail.average15Year.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">2008-2023</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Change</div>
                <div className="text-2xl font-bold">
                  {countryDetail.changeVs2008 >= 0 ? '+' : ''}{countryDetail.changeVs2008.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">vs 2008</div>
              </div>
            </div>
            
            {/* Trend Chart */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">15-Year Trend (2008-2023)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={countryDetail.trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="year" 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Renewable %', angle: -90, position: 'insideLeft' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#16a34a' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Key Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Key Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">World Rank:</span>
                  <span className="font-medium">#{countryDetail.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Points:</span>
                  <span className="font-medium">{countryDetail.dataPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">First Year:</span>
                  <span className="font-medium">{countryDetail.firstYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">{countryDetail.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">No data available for this country</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}