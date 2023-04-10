<!-- 商家地图分布图 -->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
import { mapState } from "vuex";

export default {
  name: "Map",
  data() {
    return {
      chartInstance: null,
      allData: null,
      // 缓存获取到的省份的地图矢量数据
      mapData: {},
    };
  },
  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      // console.log("Map 主题切换了！");
      this.chartInstance.dispose(); // 销毁当前的图表
      this.initChart(); // 重新以最新的主题名称初始化图表对象
      this.screenAdapter(); // 完成屏幕的适配
      this.updateChart(); // 更新图表的展示
    },
  },
  created() {
    // 当浏览器获取到服务器发送过来的数据时就会调用getData方法
    this.$socket.registerCallBack("mapData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("mapData");
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme);
      // 获取中国地图的矢量数据
      // http://localhost:8999/static/map/china.json
      // 由于我们现在获取的地图矢量数据并不是位于KOA2的后台, 所以咱们不能使用this.$http
      const result = await axios.get(
        "http://localhost:8999/static/map/china.json"
      );
      // 注册地图的矢量数据
      this.$echarts.registerMap("china", result.data);
      const initOption = {
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2e72bf",
            boderColor: "#333",
          },
        },
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20,
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      this.chartInstance.setOption(initOption);
      // 监听图表的点击事件
      // arg是所点击的省份信息
      this.chartInstance.on("click", async (arg) => {
        // 中文转换成拼音
        // console.log(arg);
        // console.log(getProvinceMapInfo(arg.name));
        const provinceInfo = getProvinceMapInfo(arg.name);
        // 获取省份的地图矢量数据
        if (!this.mapData[provinceInfo.key]) {
          const result = await axios.get(
            "http://localhost:8999" + provinceInfo.path
          );
          this.mapData[provinceInfo.key] = result.data;
          this.$echarts.registerMap(provinceInfo.key, result.data);
        }

        // 切换地图的显示
        const changeOption = {
          geo: {
            map: provinceInfo.key,
          },
        };
        this.chartInstance.setOption(changeOption);
      });
    },
    // async getData() {
    //   const { data: result } = await this.$http.get("map");
    //   this.allData = result;
    //   // 获取数据之后就需要更新图表
    //   this.updateChart();
    // },
    getData(ret) {
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      // 处理图表数据
      const seriesArr = this.allData.map((item) => {
        // 一个类别下的所有散点数据
        // 如果想在地图中显示散点数据，需要给散点图表增加一个配置coordinateSystem:geo，即配置地图坐标系统
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
          // 涟漪效果
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
        };
      });
      // 图例数据
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const dataOption = {
        legend: { data: legendArr },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        // 标题文字的大小
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        // 图例的大小
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      // 帮助图表自适应
      this.chartInstance.resize();
    },
    revertMap() {
      // 不能在省份上进行双击
      // 切换地图的显示
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revertOption);
    },
  },
};
</script>
<style scoped></style>
