import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, MarkLineComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';

echarts.use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, MarkLineComponent, TooltipComponent, SVGRenderer]);

export const SERIES = ['#1f3f9e', '#1f9a96', '#6d3fa8', '#c98a1b', '#c2552d', '#7f9bd6', '#55bdb7'];

const BASE = {
    color: SERIES,
    textStyle: { fontFamily: 'Hanken Grotesk Variable, sans-serif', color: '#4a5878' },
    tooltip: { backgroundColor: '#14306f', borderWidth: 0, textStyle: { color: '#fff', fontSize: 13 }, confine: true },
    grid: { left: 8, right: 12, top: 18, bottom: 6, containLabel: true },
};

/** ECharts with the SVG renderer: crisp on phones and light on memory. */
export default function Chart({ option, height = 240, label }: { option: Record<string, unknown>; height?: number; label: string }) {
    const element = useRef<HTMLDivElement>(null);
    const chart = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!element.current) {
            return;
        }
        const instance = echarts.init(element.current, undefined, { renderer: 'svg' });
        chart.current = instance;
        const observer = new ResizeObserver(() => instance.resize());
        observer.observe(element.current);
        return () => {
            observer.disconnect();
            instance.dispose();
        };
    }, []);

    useEffect(() => {
        const animation = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        chart.current?.setOption({ ...BASE, animation, animationDuration: 400, ...option }, true);
    }, [option]);

    return <div ref={element} role="img" aria-label={label} style={{ height, width: '100%' }} />;
}

export const axis = {
    category: (data: string[]) => ({ type: 'category', data, axisLine: { lineStyle: { color: '#c3cce0' } }, axisTick: { show: false }, axisLabel: { color: '#5a6889' } }),
    value: (format?: (v: number) => string) => ({ type: 'value', splitLine: { lineStyle: { color: '#e5eaf3' } }, axisLabel: { color: '#5a6889', formatter: format } }),
};
