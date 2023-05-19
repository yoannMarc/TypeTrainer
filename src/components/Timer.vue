<template>
    <div ref="container" class="container">
        <div v-if="interval"  class="progressBar" :style="{ width: widthPercent + 'px' }"></div>
        <!-- <button @click="interval ? stopTimer() : startTimer()"> {{ interval ?  "stop" : "start"  }}</button> -->
        <p> {{ timer }}ms </p>
    </div>
</template>

<script setup lang="ts" >


import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
    duration: Number
})

const emit = defineEmits(['getDateInterval'])
const timer = ref<number>(0)
const interval = ref<number>()
const container = ref<HTMLElement>()

let divWitdh: number = 0
let Calcduration = (props.duration) ? props.duration * 100 : 0

let dateInterval = {
    startDate: 0,
    endDate:0
}

onMounted(() => {
    divWitdh =  ((container.value) ? container.value?.offsetWidth : 1)
})



const widthPercent = computed(() => {
    return timerPercent.value  *  (divWitdh - 2)
})

const timerPercent = computed(() => {
    return (timer.value / Calcduration) 
})



function startTimer() {
    timer.value = 0
    dateInterval.startDate = Date.now()
    dateInterval.endDate = 0

    if (interval.value) endTimer()
    
    interval.value = setInterval(() => {
        timer.value++
        if(timer.value == Calcduration) {
            dateInterval.endDate = Date.now()
            clearInterval( interval.value)
            console.log('endDate : ' + dateInterval.endDate +",startDate "+ dateInterval.startDate + " Durée : " + (dateInterval.endDate -  dateInterval.startDate))
        }
       
    },10)

}

function endTimer()  {
    console.log('je termine')
    if (interval.value) clearInterval(interval.value)
    dateInterval.endDate = Date.now()
    interval.value = undefined
    emit('getDateInterval',dateInterval)
}

watch(timer,() => {
    // console.log(timer.value+' et duration '+duration)
    if (timer.value == Number(Calcduration)) {
       
        endTimer()
        
    }

})


defineExpose({
    startTimer,
    endTimer
})

</script>

<style scoped>
.container {
    border: 1px red solid;
}

.progressBar {
    border: 1px blue solid;
    background-color: blue;
    height:1vh;
}
</style>