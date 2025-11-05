// protected/dashboard/components/charts/BarChart.tsx
"use client"

import { useState, useEffect } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"
import { cardVariants } from "../../utils/animations"

interface BarChartProps {
  title: string
  data: unknown[]
  dataKey: string
  xAxisDataKey: string
  color: string
  isLoading?: boolean
}

export function BarChart({
  title,
  data,
  dataKey,
  xAxisDataKey,
  color,
  isLoading = false,
}: BarChartProps) {
  const [chartData, setChartData] = useState(data)

  useEffect(() => {
    setChartData(data)
  }, [data])

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {isLoading ? (
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <RechartsBarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={xAxisDataKey}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}