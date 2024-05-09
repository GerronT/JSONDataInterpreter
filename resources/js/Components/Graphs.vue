<template>
    <div>
        <div v-if="type === 'pie'">
            <PieChart :chartData="data" />
        </div>
        <div v-else-if="type === 'bar'">
            <BarChart :chartData="data" />
        </div>
        <div v-else-if="type === 'doughnut'">
            <DoughnutChart :chartData="data" />
        </div>
        <div v-else-if="type === 'line'">
            <LineChart :chartData="data" />
        </div>
    </div>
  
</template>

<script>
import { PieChart, BarChart, DoughnutChart, LineChart, BubbleChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
export default {
    props: ["type", "data"],
    components: { PieChart, BarChart, DoughnutChart, LineChart },
}
</script>

<style>

</style>