<template>
    <div id="container" class="mod-home" :style="{ 'min-height': documentClientHeight - 122 + 'px' }"></div>
</template>

<script>
    export default {
        data () {
            return {
                documentClientHeight: 0,
                gaoDeMap: {},
                district: {},
                polygons: []
            }
        },
        created () {
            this.documentClientHeight = this.$store.state.common.documentClientHeight
        },
        mounted () {
            this.$nextTick(function () {
                this.createMap();
                let jiangGanDistrict = this.searchDistrictBoundary('江干区');
                let xiaoShanDistrict = this.searchDistrictBoundary('萧山区');
                this.gaoDeMap.add([jiangGanDistrict, xiaoShanDistrict]);
            });
        },
        methods: {
            createMap () {
                this.gaoDeMap = new AMap.Map('container', {
                    resizeEnable: true,
                    zoom: 11,
                    mapStyle:'amap://styles/whitesmoke'
                });
            },

            /**
             * 查询行政区边界
             * @param districtName: 行政区名称
             */
            searchDistrictBoundary (districtName) {
                let districtBoundary = [];
                //实例化DistrictSearch
                this.district = new AMap.DistrictSearch({
                    subdistrict: 0,   //获取边界不需要返回下级行政区
                    showbiz: false,
                    extensions: 'all',  //返回行政区边界坐标组等具体信息
                    level: 'district'  //查询行政级别为 市
                });

                //行政区查询
                this.district.setLevel('district');
                this.district.search(districtName, function (status, result) {
                    let bounds = result.districtList[0].boundaries;
                    if (bounds) {
                        for (let i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            let polygon = new AMap.Polygon({
                                strokeWeight: 3,
                                path: bounds[i],
                                fillOpacity: 0.1,
                                fillColor: '#80d8ff',
                                strokeColor: '#0091ea'
                            });
                            districtBoundary.push(polygon);
                        }
                    }
                });
                return districtBoundary;
            }
        }
    }
</script>

<style>

</style>
