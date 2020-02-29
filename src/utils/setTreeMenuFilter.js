function toTree(source, { id, parentId, children, rootId }) {
  let cloneData = JSON.parse(JSON.stringify(source))
  return cloneData.filter(father => {
    let branchArr = cloneData.filter(child => father[id] == child[parentId]);
    if (branchArr.length > 0) {
      father[children] = branchArr
    }
    return father[parentId] == rootId        // 如果第一层不是parentId=0，请自行修改
  })
}

export default toTree

// let res = toTree(data, 'id', 'parentId', 'children')