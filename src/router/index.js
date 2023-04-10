import Vue from "vue";
import VueRouter from "vue-router";
// import SellerPage from "@/views/SellerPage";
// import TrendPage from "@/views/TrendPage";
// import MapPage from "@/views/MapPage";
// import RankPage from "@/views/RankPage";
// import HotPage from "@/views/HotPage";
// import StockPage from "@/views/StockPage";
Vue.use(VueRouter);
import ScreenPage from "@/views/ScreenPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/screen",
  },
  {
    path: "/screen",
    component: ScreenPage,
  },
  // 测试使用的路由组件
  // {
  //   path: "/sellerpage",
  //   component: SellerPage,
  // },
  // {
  //   path: "/trendpage",
  //   component: TrendPage,
  // },
  // {
  //   path: "/mappage",
  //   component: MapPage,
  // },
  // {
  //   path: "/rankpage",
  //   component: RankPage,
  // },
  // {
  //   path: "/hotpage",
  //   component: HotPage,
  // },
  // {
  //   path: "/stockpage",
  //   component: StockPage,
  // },
];

const router = new VueRouter({ routes });

export default router;
