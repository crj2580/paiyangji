import axios from "axios"
/**
 * Vite 读取public json文件
 * @function loadJson 用于Vite环境,使用Promise的形式读取public/config/路径下的json文件
 * @generics T 当前json文件的模型,你应当在.d.ts文件中提供interface或者type
 * @param fileName string json文件名称,例如:config
 * @example
 * loadJson<Interface.ConfigInterface>("config").then((res)=>{
 *     console.log('res',res.color)
 *   })
 */
export function loadJson(fileName) {
  return new Promise((resolve, reject) => {
    axios
      .get(`./config/${fileName}.json`)
      .then((res) => {
        if (res.status < 400) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}


export const configOut  = await loadJson("data")

