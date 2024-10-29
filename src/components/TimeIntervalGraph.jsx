import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-dayjs-4";

function TimeIntervalGraph({ timestamps, timeRange }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!timeRange) return; // Ensure timeRange is defined
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");

        const data = {
            labels: timestamps.map((t) => dayjs(t.timestamp).toDate()),
            datasets: [
                {
                    label: "Time Series Data",
                    data: timestamps.map((t) => ({
                        x: dayjs(t.timestamp).toDate(),
                        y: t.type,
                    })),
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    stepped: true,
                },
            ],
        };

        const config = {
            type: "line",
            data: data,
            options: {
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "minute",
                        },
                        min: timeRange.start, // Ensure timeRange is defined before using
                        max: timeRange.end,
                        title: {
                            display: true,
                            text: "Timestamp",
                        },
                    },
                    y: {
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: "Type",
                        },
                        ticks: {
                            stepSize: 1,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        };

        chartInstanceRef.current = new Chart(ctx, config);

        return () => {
            chartInstanceRef.current.destroy();
        };
    }, [timestamps, timeRange]);

    return (
        <div>
            <canvas ref={chartRef} />
        </div>
    );
}

export default TimeIntervalGraph;
