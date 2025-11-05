"use client"

import { useState, useEffect } from "react"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieLabelRenderProps,
} from "recharts"
import { motion } from "framer-motion"
import { cardVariants } from "../../utils/animations"

// Définir une interface pour les données du graphique
interface ChartDataItem {
  name: string;
  [key: string]: unknown; // Permet d'accepter d'autres propriétés dynamiques
}

interface PieChartProps {
  title: string
  data: ChartDataItem[]
  dataKey: string
  nameKey: string
  colors: string[]
  isLoading?: boolean
}

export function PieChart({
  title,
  data,
  dataKey,
  colors,
  isLoading = false,
}: PieChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>(data)

  useEffect(() => {
    setChartData(data)
  }, [data])

  // Fonction pour calculer le pourcentage et formater le label
  const renderLabel = (props: PieLabelRenderProps) => {
    const { name, value } = props;
    if (name === undefined || value === undefined) return null;
    
    // Calculer le total des valeurs
    const total = chartData.reduce((sum, entry) => sum + (Number(entry[dataKey]) || 0), 0);
    
    // Calculer le pourcentage
    const percent = total > 0 ? (Number(value) / total) : 0;
    
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

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
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}