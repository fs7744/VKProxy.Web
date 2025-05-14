<template>
    <el-carousel :interval="4000" arrow="always">
        <el-carousel-item :key="1">
            <h3 >{{ $t('intro1') }}</h3>
        </el-carousel-item>
        <el-carousel-item :key="2">
            <h3 >{{ $t('intro2') }}</h3>
        </el-carousel-item>
        <el-carousel-item :key="3">
            <h3 >{{ $t('intro3') }}</h3>
        </el-carousel-item>
    </el-carousel>
</template>


<script setup lang="ts">

</script>

<style scoped>

.el-carousel__item h3 {
    opacity: 0.75;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    height: 100%;
}

.el-carousel__item {
    justify-content: center;
}

span{
  display:inline-block;
  width:100%;
}
</style>