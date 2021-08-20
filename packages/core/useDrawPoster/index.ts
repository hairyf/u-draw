import { createDrawOptions } from '../utils'

export const useDrawPoster: UseDrawPoster = (...args) => {
  const options = createDrawOptions(<any>args[0], <any>args[1])

  // #region TODO: 初始化查询页面绘制实例, 实现单例模式
  // #endregion
}
/**
 * 查询 fields 信息
 * @param selector
 * @param componentThis
 * @param options
 * @returns
 */
export const queryFields = (selector: string, componentThis?: any, options?: UniApp.NodeField) => {
  const query = componentThis
    ? uni.createSelectorQuery().in(componentThis)
    : uni.createSelectorQuery()
  return new Promise<UniApp.NodeInfo>((resolve) => {
    query
      .select(selector)
      .fields(options || {}, resolve)
      .exec()
  })
}
