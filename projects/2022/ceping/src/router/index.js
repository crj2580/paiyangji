import Vue from 'vue'
import { createRouter, createWebHistory }  from 'vue-router'


const Home = () => import('../views/home/index')
const Answer = () => import('../views/answer/index')
const Score = () => import('../views/score/index')
const Takephoto = () => import('../views/takephoto/index')


// 2.创建路由对象
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/answer',
    component: Answer
  },
  {
    path: '/score/:score',
    component: Score
  },
  {
    path: '/takephoto/:score',
    component: Takephoto
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// 3.导出router
export default router
