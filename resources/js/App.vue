<template>
    <div class="p-4">
        <div class="max-w-7xl mx-auto">
            <div v-if="JSONData" class="px-4 md:px-8">
                <!-- GRAPHS -->
                <Graphs :type="chartType" :data="groupedGraphData" />

                <!-- GRAPH SELECTION -->
                <div class="flex gap-2 flex-wrap justify-center text-xl py-2" data-aos="fade-down">
                    <div v-for="chartT,i in chartTypeOptions" :key="i" @click="chartType = chartT.value" class="rounded-lg font-bold border p-2" :class="chartType == chartT.value ? 'bg-dark-blue text-white border-white' : 'cursor-pointer bg-white hover:bg-gray-100 border-gray-200'">
                        <p>{{ chartT.label }}</p>
                    </div>
                </div>

                <!-- SELECT GROUPINGS SELECTION (COUNTRY OR PRODUCT) -->
                <div class="text-center flex gap-2 items-center py-2">
                    <label>Select Groupings:</label>
                    <select v-model="groupBy" class="rounded-md border-gray-300 border focus:outline-none h-10 px-2">
                        <option :value="option.value" v-for="(option, i) in groupByOptions" :key="i">
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <!-- SELECTED GROUPING LIST -->
                <div class="flex gap-1 flex-wrap" data-aos="fade-down">
                    <div v-for="key in Object.keys(groupedData)" :key="key" @click="selectGroupedDataSet(key)" class="cursor-pointer rounded-lg font-bold border p-2" :class="selectedKey == key ? 'bg-dark-blue text-white border-white hover:bg-navy-blue' : 'bg-white hover:bg-gray-100 border-gray-200'">
                        <p>{{ key }}</p>
                    </div>
                </div>

                <!-- TABLE FOR SELECTED COUNTRY/PRODUCT -->
                <div v-for="(data, key) in groupedData" :key="key">
                    <div v-if="key == selectedKey" class="h-auto w-full">
                        <sub-table :data="data" data-aos="fade-right" />
                    </div>
                </div>
            </div>

            <div v-else class="text-center flex flex-col justify-center items-center mx-auto">
                <div class="loader"></div>
                <div class="text-2xl md:text-4xl font-din2014b loading text-gray-300">Loading</div>
            </div>
        </div>
    </div>
</template>

<script>
const JSONURL = "https://www.fancensus.com/test/dataset1.json";
import SubTable from "./Components/SubTable.vue";
import Graphs from "./Components/Graphs.vue";

export default {
    components: { SubTable, Graphs },
    data() {
        return {
            JSONData: null,

            selectedKey: null,
            selectedData: null,
            

            groupedData: null,
            groupedGraphData: null,

            groupByOptions: [
                { label: "Country", value: "countrycode" },
                { label: "Product", value: "product" }
            ],
            groupBy: "countrycode",

            chartTypeOptions: [
                { label: "Bar Chart", value: "bar" },
                { label: "Pie Chart", value: "pie" },
                { label: "Doughnut Chart", value: "doughnut" },
                { label: "Line Chart", value: "line" },
            ],
            chartType: "bar"
        };
    },
    computed: {
        selectedData() {
            return this.groupedData[this.selectedKey];
        },
    },
    watch: {
        groupBy() {
            this.groupAndMapDataSet(this.JSONData);
            this.selectedKey = null;
        },
    },
    mounted() {
        this.fetchJSON(JSONURL).then((data) => {
            this.JSONData = data;
            this.groupAndMapDataSet(data);
        });
    },
    methods: {
        async fetchJSON(url) {
            return await (await fetch(url)).json();
        },
        selectGroupedDataSet(key) {
            if (key !== this.selectedKey) {
                this.selectedKey = key;
                let productGroupedCountry = this.groupDataByKey(this.groupedData[this.selectedKey], this.findSelectedGroupByInverse());
                this.groupedGraphData = this.mapDataSet(productGroupedCountry, this.findSelectedGroupByInverse(), key);
            } else {
                this.selectedKey = null;
                this.groupAndMapDataSet(this.JSONData);
            }
        },
        groupAndMapDataSet(data) {
            this.groupedData = this.groupDataByKey(data, this.groupBy);
            this.groupedGraphData = this.mapDataSet(this.groupedData);
        },
        groupDataByKey(data, key) {
            return data.reduce(function (r, a) {
                r[a[key]] = r[a[key]] || [];
                r[a[key]].push(a);
                return r;
            }, Object.create(null));
        },
        mapDataSet(data, groupBy = this.groupBy, initialKey=null) {
            let labels = [];
            let items = [];
            let colours = [];

            for (const [key, value] of Object.entries(data)) {
                labels.push(key);
                items.push(value.length);
                colours.push('#'+Math.floor(Math.random()*16777215).toString(16)); // generate random colour
            }

            return {
                labels: labels,
                datasets: [
                    {
                        label: "Number of Activities per " + this.findGroupByLabelByValue(groupBy) + (initialKey ? ' ('+initialKey+')' : ''),
                        data: items,
                        backgroundColor: colours,
                    },
                ],
            };
        },
        findGroupByLabelByValue(value) {
            for (let i=0;i<this.groupByOptions.length;i++) {
                if (this.groupByOptions[i].value === value) {
                    return this.groupByOptions[i].label;
                }
            }
        },
        findSelectedGroupByInverse() {
            for (let i=0;i<this.groupByOptions.length;i++) {
                if (this.groupByOptions[i].value !== this.groupBy) {
                    return this.groupByOptions[i].value;
                }
            }
        }
    },
};
</script>

<style scoped>
.expand {
    max-height: 2000px;
    animation: slideDown 0.6s linear;
    overflow: hidden;
}

.expand-leave-active.expand-leave-to {
    transition: max-height 0.6 ease;
    max-height: 0;
}

@keyframes slideDown {
    from {
        max-height: 0;
    }
    to {
        max-height: 2000px;
    }
}

.loader {
    font-size: 50px;
    width: 150px;
    height: 150px;
    margin: 10px auto;
    text-indent: -9999em;
    border-top: 0.5em solid #212b36;
    border-right: 0.5em solid #d5e2f0;
    border-bottom: 0.5em solid #d5e2f0;
    border-left: 0.5em solid #d5e2f0;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
}

.loader,
.loader:after {
    border-radius: 50%;
}

@-webkit-keyframes load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
@keyframes load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
</style>