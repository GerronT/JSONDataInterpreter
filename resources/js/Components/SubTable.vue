<template>
    <section v-if="JSONGroupedData">
        <div v-if="JSONGroupedData.length > 0" class="flex flex-col">
            <div class="border shadow-lg bg-white p-4 my-4 inline-block">
                <div class="flex flex-wrap gap-1 items-center">
                    <span @click="previousPage()" class="rounded-md p-2 text-center border-gray-300 border" :class="isFirstPage() ? 'text-gray-500' : 'cursor-pointer hover:bg-gray-100'">{{ "<< Previous" }}</span>
                    <span v-for="j in pagination" :key="j" class="rounded-md p-2 text-center border-gray-300 border" @click="setPageNumber(j)" :class="currentPage == j ? 'bg-dark-blue text-white border-white' : isInteger(j) ? 'hover:bg-gray-100 cursor-pointer' : ''">{{ j }}</span>
                    <span @click="nextPage()" class="rounded-md p-2 text-center border-gray-300 border" :class="isLastPage() ? 'text-gray-500' : 'cursor-pointer hover:bg-gray-100'">{{ "Next >>" }}</span>
                    <div class="p-2 text-center flex gap-2 items-center">
                        <input v-model="inputPageNumber" type="number" placeholder="#" :min="1" :max="totalPageNumber" class="rounded-md p-2 border-gray-300 border focus:outline-none w-20" />
                        <button @click="jumpPageNumber()" class="py-2 px-4 rounded-md bg-dark-blue hover:bg-navy-blue text-white text-center">Jump</button>
                    </div>
                    <div class="p-4 text-center flex gap-2 items-center">
                        <label>Results per page:</label>
                        <select v-model="itemsPerPage" class="rounded-md border-gray-300 border focus:outline-none w-20 h-10">
                            <option :value="option" v-for="(option, i) in itemsPerPageOptions" :key="i">
                                {{ option }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <label class="self-end text-gray-400 mb-2">Showing {{ (itemsPerPage * currentPage) - itemsPerPage + 1 }} - {{((itemsPerPage * currentPage) - itemsPerPage + 1) + JSONGroupedData.length - 1}} of {{data.length}}</label>
        </div>

        
        <ol class="collection collection-container shadow-lg">
            <li class="item item-container text-white bg-dark-blue rounded shadow font-bold py-4 text-sm md:text-base border-b">
                <div class="attribute md:pl-4" data-name="Name">Name</div>
                <div class="attribute" data-name="Country Code">Country Code</div>
                <div class="attribute" data-name="Product">Product</div>
                <div class="attribute" data-name="Date">Date</div>
                <div class="attribute md:pr-4" data-name="Headline">Headline</div>
            </li>
            <div v-if="JSONGroupedData.length > 0">
                <li v-for="(entry, i) in JSONGroupedData" :key="i" class="flex flex-col text-sm md:text-base">
                    <div class="shadow-md item item-container py-4 border-b hover:bg-gray-100 bg-gray-50">
                        <div class="attribute md:pl-4" data-name="Name">{{ entry.name }}</div>
                        <div class="attribute" data-name="Country Code">{{ entry.countrycode }}</div>
                        <div class="attribute" data-name="Product">{{ entry.product }}</div>
                        <div class="attribute" data-name="Date">{{ formatDate(entry.date) }}</div>
                        <div class="attribute md:pr-4" data-name="Headline"><p v-html="entry.headline"></p></div>
                    </div>
                </li>
            </div>
            <div v-else class="text-gray-300 p-4 bg-white">0 results found</div>
        </ol>
    </section>
</template>

<script>
import moment from "moment";
export default {
    props: ["data"],
    data() {
        return {
            JSONGroupedData: null,

            itemsPerPageOptions: [10, 20, 50, 100, 500, 1000],
            itemsPerPage: 20,

            totalPageNumber: null,
            currentPage: 1,
            inputPageNumber: null,
            pagination: null,
        };
    },
    watch: {
        currentPage() {
            this.refreshData();
            this.inputPageNumber = null;
        },
        itemsPerPage() {
            this.refreshData();
            this.currentPage = 1;
        },
    },
    mounted() {
        this.refreshData();
    },
    methods: {
        formatDate(date) {
            return moment(date).format("DD/MM/YYYY - h:mma");
        },
        refreshData() {
            let index = this.currentPage * this.itemsPerPage - this.itemsPerPage;
            this.JSONGroupedData = this.data.slice(index, this.itemsPerPage + index);
            this.totalPageNumber = Math.ceil(this.data.length / this.itemsPerPage);
            this.pagination = this.paginationRules();
        },
        isInteger(number) {
            return Number.isInteger(number);
        },
        setPageNumber(pageNum) {
            if (this.isInteger(pageNum)) {
                this.currentPage = pageNum;
            }
        },
        isFirstPage() {
            return this.currentPage <= 1;
        },
        isLastPage() {
            return this.currentPage >= this.totalPageNumber;
        },
        previousPage() {
            if (!this.isFirstPage()) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (!this.isLastPage()) {
                this.currentPage++;
            }
        },
        jumpPageNumber() {
            if (this.inputPageNumber >= 1 && this.inputPageNumber <= this.totalPageNumber) {
                this.currentPage = this.inputPageNumber;
            }
        },
        paginationRules() {
            let leftPaging = []; // should include current page number

            // can have up to 6 on each side before showing ellipsis
            if (this.currentPage - 7 <= 0) {
                // show 1 up to current page (including itself)
                for (let i = 1; i <= this.currentPage; i++) {
                    leftPaging.push(i);
                }
            } else {
                leftPaging.push(1, 2, "...");
                for (let i = this.currentPage - 3; i <= this.currentPage; i++) {
                    leftPaging.push(i);
                }
            }

            let rightPaging = [];
            if (this.currentPage + 7 > this.totalPageNumber) {
                for (let i = this.currentPage + 1; i <= this.totalPageNumber; i++) {
                    rightPaging.push(i);
                }
            } else {
                for (let i = this.currentPage + 1; i <= this.currentPage + 3; i++) {
                    rightPaging.push(i);
                }
                rightPaging.push("...", this.totalPageNumber - 1, this.totalPageNumber);
            }

            if (!leftPaging.includes("...") || !rightPaging.includes("...")) {
                if (this.totalPageNumber <= 10) {
                    leftPaging = [];
                    for (let i = 1; i <= this.totalPageNumber; i++) {
                        leftPaging.push(i);
                    }
                    rightPaging = [];
                } else {
                    if (!leftPaging.includes("...")) {
                        leftPaging = [];
                        for (let i = 1; i <= 10; i++) {
                            leftPaging.push(i);
                        }
                        rightPaging = ["...", this.totalPageNumber - 1, this.totalPageNumber];
                    } else if (!rightPaging.includes("...")) {
                        rightPaging = [];
                        for (let i = this.totalPageNumber - 9; i <= this.totalPageNumber; i++) {
                            rightPaging.push(i);
                        }
                        leftPaging = [1, 2, "..."];
                    }
                }
            }

            return leftPaging.concat(rightPaging);
        },
    },
};
</script>

<style scoped>
ol.collection {
    margin: 0px;
    padding: 0px;
}

li {
    list-style: none;
}

* {
    box-sizing: border-box;
}

/* 1 Column Card Layout */
@media screen and (max-width: 767px) {
    .collection-container {
        display: grid;
        grid-template-columns: 1fr;
    }

    .item {
        padding: 10px;
    }

    /* Don't display the first item, since it is used to display the header for tabular layouts*/
    .collection-container > li:first-child {
        display: none;
    }

    .attribute::before {
        content: attr(data-name);
        font-weight: bold;
        color: #000000;
    }

    /* Attribute name for first column, and attribute value for second column. */
    .attribute {
        display: grid;
        grid-template-columns: minmax(9em, 30%) 1fr;
    }

    .multiselect-font-size {
        --ms-font-size: 0.75rem;
        /* --ms-line-height: 1rem; */

        --ms-option-font-size: 0.75rem;
        /* --ms-option-line-height: 1rem; */

        --ms-tag-font-size: 0.75rem;
        /* --ms-tag-line-height: 1rem; */
    }
}

/* Tabular Layout */
@media screen and (min-width: 768px) {
    /* The maximum column width, that can wrap */
    .item-container {
        display: grid;
        grid-template-columns: 2fr 1fr 2fr 2fr 3fr;
        grid-gap: 20px;
    }

    .attribute-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
    }

    /* Definition of wrapping column width for attribute groups. */

    .details {
        --column-width-min: 14em;
    }

    /* In order to maximize row lines, only display one line for a cell */
    .attribute-container {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .multiselect-font-size {
        --ms-font-size: 0.875rem;
        /* --ms-line-height: 1.25rem; */

        --ms-option-font-size: 0.875rem;
        /* --ms-option-line-height: 1.25rem; */

        --ms-tag-font-size: 0.875rem;
        /* --ms-tag-line-height: 1.25rem; */
    }
}
</style>