<template>
    <div>
        <header>
            <Header :routelist="routelist"></Header>
        </header>
        <div class="map-container">
            <div id="container" :style="`height: 84vh`">
                <div class="tool_search">
                    <el-input id="tipInput" v-model="inputSearchVal" placeholder="请输入搜索名称">
                        <el-button slot="append" icon="el-icon-search" @click="searchKeyword"
                            style="width:60px"></el-button>
                    </el-input>
                </div>
                <div class="tool_search_result" v-if="showsearchResult">
                    <ul>
                        <li @click="markerResult(item)" v-for="(item, index) in poiList" :key="index">{{ item.name }}</li>
                    </ul>
                </div>
                <div class="mapcard">
                    <label>坐标：</label>
                    <el-input v-model="inputData" size="small " placeholder="Please input"
                        style="width:200px;max-width:100%;" />
                    <el-button style="margin-left: 5px; " type="primary" icon="el-icon-document" size="small "
                        @click="handleCopy(inputData, $event)">
                        复制
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import AMapLoader from '@amap/amap-jsapi-loader';

import mapConfig from "@/utils/mapConfig";
import Header from '@/components/Header.vue';
import clip from '@/utils/clipboard'

let AMap = null;

export default {
    name: "PickPoint",
    components: { Header },
    data() {
        return {
            routelist: [
                { route: '/Home', name: '主页' },
                { route: '/UserTable', name: '用户管理' },
                { route: '/PointTable', name: '地图点管理' },
                { route: '/AbstractTable', name: '详情页管理' },
                { route: '/AddPoint', name: '添加地图点' },
            ],
            map: null,
            showsearchResult: false,
            autoCompleteComponent: null,
            placeSearchComponent: null,
            markerList: [],
            mapInput: "",
            inputSearchVal: "",
            poiList: [],
            pointname: '',
            inputData: '',
        };
    },
    computed: {},
    mounted() {
        this.initmap();
        this.map.on("move", () => {
            this.updateFloatingCardPosition();
        });
    },
    methods: {
        initmap() {
            this.contentHeight = window.innerHeight;
            //self = this;
            AMapLoader.load({
                key: mapConfig.JSAPIKey,
                version: "2.0",
                plugins: [
                    "AMap.ToolBar",
                    "AMap.Scale",
                    "AMap.Geolocation",
                    "AMap.PlaceSearch",
                    "AMap.AutoComplete"
                ],
            }).then(map => {
                AMap = map;
                this.map = new AMap.Map("container", {
                    //center: MY_POSITION,
                    zoom: 11
                });
                this.map.addControl(new AMap.Scale());
                this.map.addControl(new AMap.ToolBar());
                let geolocation = new AMap.Geolocation({
                    // 是否使用高精度定位，默认：true
                    enableHighAccuracy: true,
                    // 设置定位超时时间，默认：无穷大
                    timeout: 10000,
                    // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                    offset: [20, 80],
                    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    zoomToAccuracy: true,
                    //  定位按钮的排放位置,  RB表示右下
                    position: 'LB',
                })
                this.map.addControl(geolocation)
                this.mapSearchInit();
            }).catch(e => {
                console.log(e);
            });
            // 搜索
        },
        handleMarkerClick(e) {
            this.selectedPoint = e.target.getExtData();
            this.showcard = true;
        },
        markerResult(data) {
            this.map.remove(this.markerList)
            let marker = new AMap.Marker({
                position: [Number(data.location.lng), Number(data.location.lat)],
                autoRotation: true,
                icon: "https://picture-tjl.oss-cn-hangzhou.aliyuncs.com/WuHan_Flower/map-marker_mapcard.png",
                offset: new AMap.Pixel(-16, -32),
            });
            marker.setMap(this.map);
            console.log([Number(data.location.lng), Number(data.location.lat)])
            this.inputData = [Number(data.location.lng), Number(data.location.lat)].join(",")
            this.map.setFitView();
            this.markerList.push(marker);
        },
        mapSearchInit() {
            var autoOptions = {
                input: "tipInput",
            };
            var autoCompleteComponent = new AMap.AutoComplete(autoOptions);
            this.autoCompleteComponent = autoCompleteComponent;
            this.placeSearchComponent = new AMap.PlaceSearch();
        },
        searchKeyword() {
            let cur = this;
            this.placeSearchComponent.search(this.inputSearchVal, function (status, result) {
                console.log(status);
                console.log(result);
                if (status === "complete" && result.info === "OK") {
                    cur.showsearchResult = true;
                    cur.poiList = result.poiList.pois;
                }
                else {
                    cur.showsearchResult = false;
                    cur.poiList = [];
                    cur.$message({
                        message: "没有查到结果！",
                        type: "warning",
                    });
                }
            });
        },
        handleCopy(text, event) {
            clip(text, event)
        },
    },
    beforeDestroy() {
        this.map.destroy();
        this.map = null;
    },
}
</script>

<style scoped>
.map-container {
    position: relative;
}

.tool_search {
    width: 250px;
    top: 30px;
    left: 20px;
    height: 32px;
    background: #eee;
    opacity: 0.8;
    border-radius: 4px;
    margin-top: 2px;
    bottom: auto;
    z-index: 12;
    position: absolute;
    text-align: left;
    font-size: 14px;
}

::v-deep .el-input-group__append,
.el-input-group__prepend {
    border: 1px solid rgb(194, 193, 193);
    border-left: none;
    background: rgb(231, 230, 230);
    color: rgb(77, 77, 73);
}

::v-deep .el-input__inner {
    border: 1px solid rgb(194, 193, 193);
}

.tool_search_result {
    width: 250px;
    top: 70px;
    left: 20px;
    height: 300px;
    border: 1px solid rgb(175, 175, 173);
    border-top: none;
    background: #fff;
    opacity: 0.8;
    margin-top: 2px;
    bottom: auto;
    z-index: 12;
    position: absolute;
    text-align: left;
    font-size: 14px;
}

.tool_search_result ul {
    width: 100%;
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
}

.tool_search_result ul li {
    font-size: 12px;
    color: rgb(23, 40, 75);
    text-align: center;
    width: 100%;
    height: 9.75%;
    float: left;
    margin: 0px 0px 1px 0;
    padding: 2.5% 4px 0 4px;
    border-bottom: 1px dashed rgb(170, 170, 172);
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tool_search_result ul li:last-child {
    border: none;
}

.mapcard {
    position: absolute;
    height: 55px;
    right: 20px;
    top: 10px;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 170;
    width: 350px;
    margin: 20px auto;
    padding: 10px 0;
    text-align: center;
}
</style>
