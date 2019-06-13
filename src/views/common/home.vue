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
                mouseTool: {}
            }
        },
        created () {
            this.documentClientHeight = this.$store.state.common.documentClientHeight
        },
        mounted () {
            this.$nextTick(function () {
                this.createMap();
                this.drawPoint(this.gaoDeMap);
                // this.searchDistrictBoundary('江干区', this.gaoDeMap);
                // this.searchDistrictBoundary('萧山区', this.gaoDeMap);
            });
        },
        methods: {
            createMap () {
                this.gaoDeMap = new AMap.Map('container', {
                    resizeEnable: true,
                    defaultCursor: 'pointer',
                    zoom: 11,
                    mapStyle: 'amap://styles/whitesmoke'
                });
                this.gaoDeMap.add(this.displayBoundary());
            },

            /**
             * 查询行政区边界
             * @param districtName: 行政区名称
             * @param map 地图对象
             */
            searchDistrictBoundary (districtName, map) {
                //实例化DistrictSearch
                if (Object.keys(this.district).length === 0) {
                    this.district = new AMap.DistrictSearch({
                        subdistrict: 0,   //获取边界不需要返回下级行政区
                        showbiz: false,
                        extensions: 'all',  //返回行政区边界坐标组等具体信息
                        level: 'district'  //查询行政级别为 市
                    });
                }
                //行政区查询
                this.district.setLevel('district');
                this.district.search(districtName, function (status, result) {
                    let bounds = result.districtList[0].boundaries;
                    if (bounds) {
                        let districtBoundary = [];
                        for (let i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            let polygon = new AMap.Polygon({
                                strokeWeight: 1,
                                path: bounds[i],
                                fillOpacity: 0.1,
                                fillColor: '#80d8ff',
                                strokeColor: '#0091ea'
                            });
                            districtBoundary.push(polygon);
                        }
                        map.add(districtBoundary);
                    }
                });
            },

            drawPoint (map) {
                let that = this;
                //监听draw事件可获取画好的覆盖物
                if (Object.keys(this.mouseTool).length === 0) {
                    this.mouseTool = new AMap.MouseTool(map);
                }
                this.mouseTool.marker();
                this.mouseTool.on('draw', function (evt) {
                    //  2 | 120.417853 | 30.328179 | 2019-06-13 11:36:41
                    // that.savePoint(evt.obj);
                });
            },

            savePoint (marker) {
                let lngLat = marker.getPosition();
                this.$http({
                    url: this.$http.adornUrl('/gen/point/save'),
                    method: 'post',
                    data: this.$http.adornData({
                        'lng': lngLat.lng,
                        'lat': lngLat.lat
                    })
                }).then(({data}) => {
                    console.log(data);
                })
            },

            displayBoundary () {
                const boundary = [
                    [120.414077, 30.318844],
                    [120.417853, 30.328179],
                    [120.419269, 30.331661],
                    [120.438581, 30.373397],
                    [120.440083, 30.374656],
                    [120.441714, 30.376026],
                    [120.44622, 30.378543],
                    [120.450211, 30.380135],
                    [120.456091, 30.381764],
                    [120.460296, 30.382875],
                    [120.498276, 30.389094],
                    [120.506259, 30.389316],
                    [120.567799, 30.387984],
                    [120.633069, 30.389613],
                    [120.640451, 30.388872],
                    [120.693494, 30.377914],
                    [120.69785, 30.375341],
                    [120.702099, 30.370187],
                    [120.703815, 30.365892],
                    [120.703987, 30.329746],
                    [120.704502, 30.316113],
                    [120.705875, 30.309445],
                    [120.710682, 30.298181],
                    [120.714115, 30.293067],
                    [120.718321, 30.28914],
                    [120.720703, 30.287037],
                    [120.721915, 30.286332],
                    [120.706319, 30.272136],
                    [120.692715, 30.26109],
                    [120.669541, 30.233508],
                    [120.643362, 30.21786],
                    [120.642504, 30.216376],
                    [120.60848, 30.235898],
                    [120.565994, 30.232969],
                    [120.557712, 30.232376],
                    [120.53546, 30.23727],
                    [120.523959, 30.240236],
                    [120.506792, 30.242238],
                    [120.491944, 30.247058],
                    [120.482417, 30.248763],
                    [120.46888, 30.255649],
                    [120.452057, 30.259059],
                    [120.430256, 30.265287],
                    [120.41927, 30.273589],
                    [120.412747, 30.265732],
                    [120.392834, 30.276554],
                    [120.384079, 30.267511],
                    [120.374981, 30.258911],
                    [120.362278, 30.252387],
                    [120.351464, 30.250459],
                    [120.340649, 30.25298],
                    [120.336014, 30.255797],
                    [120.323826, 30.267362],
                    [120.320221, 30.270179],
                    [120.318161, 30.273886],
                    [120.304557, 30.286597],
                    [120.299236, 30.28808],
                    [120.292884, 30.288821],
                    [120.293227, 30.311349],
                    [120.294429, 30.315128],
                    [120.299407, 30.315721],
                    [120.300266, 30.32513],
                    [120.293828, 30.325426],
                    [120.296232, 30.335428],
                    [120.301639, 30.344243],
                    [120.300351, 30.347798],
                    [120.304042, 30.348909],
                    [120.307132, 30.350983],
                    [120.310565, 30.350983],
                    [120.318633, 30.352687],
                    [120.325757, 30.353649],
                    [120.326659, 30.35639],
                    [120.327903, 30.358427],
                    [120.331036, 30.359797],
                    [120.336057, 30.361167],
                    [120.341121, 30.366092],
                    [120.347043, 30.36935],
                    [120.355369, 30.373867],
                    [120.362664, 30.374682],
                    [120.371248, 30.377421],
                    [120.37923, 30.380754],
                    [120.398027, 30.384974],
                    [120.399271, 30.384863],
                    [120.400172, 30.384345],
                    [120.400559, 30.381938],
                    [120.400859, 30.377199],
                    [120.40043, 30.374867],
                    [120.399658, 30.373312],
                    [120.397168, 30.372275],
                    [120.396096, 30.371016],
                    [120.388886, 30.370424],
                    [120.380989, 30.356797],
                    [120.382534, 30.35576],
                    [120.377814, 30.345243],
                    [120.380646, 30.343909],
                    [120.383307, 30.346798],
                    [120.385281, 30.345909],
                    [120.382963, 30.342872],
                    [120.396353, 30.33265],
                    [120.407511, 30.324649]
                ];
                return new AMap.Polygon({
                    strokeWeight: 1,
                    path: boundary,
                    fillOpacity: 0.1,
                    fillColor: '#80d8ff',
                    strokeColor: '#0091ea'
                });
            }
        }
    }
</script>

<style>

</style>
