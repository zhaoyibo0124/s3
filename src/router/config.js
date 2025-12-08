import TabsView from "@/layouts/tabs/TabsView";
import BlankView from "@/layouts/BlankView";

// 路由配置
const options = {
  routes: [
    {
      path: "/login",
      name: "登录",
      component: () => import("@/pages/login/Login"),
    },
    {
      path: "*",
      name: "404",
      component: () => import("@/pages/exception/404"),
    },
    {
      path: "/403",
      name: "403",
      component: () => import("@/pages/exception/403"),
    },
    {
      path: "/ai",
      name: "Ai",
      redirect: "/index",
      component: () => import("@/pages/aiCommon"),
      children: [
        {
          path: "/index",
          name: "Ai编标",
          component: () => import("@/pages/ai/query.vue"),
        },
        {
          path: "/ai",
          name: "Ai编标",
          component: () => import("@/pages/ai/index"),
        },
        {
          path: "/init",
          name: "Ai编标",
          component: () => import("@/pages/ai/init"),
        },
        {
          path: "/document",
          name: "Ai编标",
          component: () => import("@/pages/ai/document"),
        },
        {
          path: "/result",
          name: "Ai编标",
          component: () => import("@/pages/ai/result"),
        },
        {
          path: "/review",
          name: "文件编审",
          component: () => import("@/pages/docReview"),
        },
        {
          path: "/reviewDetail",
          name: "文件编审",
          component: () => import("@/pages/docReview/detail.vue"),
        },
        {
          path: "/record",
          name: "Ai编标",
          component: () => import("@/pages/record"),
        },
      ],
    },
    {
      path: "/",
      name: "首页",
      component: TabsView,
      redirect: "/login",
      children: [],
    },
  ],
};
if (localStorage.getItem("routesConfigData")) {
  const routesConfigData = JSON.parse(localStorage.getItem("routesConfigData"));
  const menuTemplate = [];
  routesConfigData &&
    routesConfigData.forEach((item) => {
      if (item.menuLevel == "1") {
        const template = {};
        template.path = item.menuCode;
        template.name = item.menuName;
        template.menuShow = item.menuShow;
        template.meta = {
          authority: {
            permission: "*",
          },
          pAuthorities: [],
          icon: item.menuIcon,
          page: {
            cacheAble: false,
          },
        };
        if (item.menuUrl != "#") {
          template.component = () =>
            import("@/pages/" + item.menuUrl.replace("@/pages/", ""));
        } else {
          template.component = BlankView;
          template.children = [];
          routesConfigData.forEach((every) => {
            if (every.menuLevel == "2" && every.menuParent == item.menuCode) {
              const childrenTemplate = {};
              childrenTemplate.path = every.menuCode;
              childrenTemplate.name = every.menuName;
              childrenTemplate.menuShow = every.menuShow;
              childrenTemplate.meta = {
                authority: {
                  permission: "*",
                },
                pAuthorities: [],
              };
              childrenTemplate.component = () =>
                import("@/pages/" + every.menuUrl.replace("@/pages/", ""));
              template.children.push(childrenTemplate);
            }
          });
        }
        menuTemplate.push(template);
      }
    });
  menuTemplate.forEach((item, i) => {
    options.routes[4].children.splice(++i, 0, item);
  });
}
export default options;
