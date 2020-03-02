function toTreeData(data, attributes) {
  let resData = data;
  let tree = [];
  console.log("---------------------")
  for (let i = 0; i < resData.length; i++) {
    if (resData[i].resParentId === attributes.rootId) {
      let obj = {
        id: resData[i][attributes.id],
        title: resData[i][attributes.name],
        children: []
      };
      tree.push(obj);
      resData.splice(i, 1);
      i--;
    }
  }
  run(tree);
  function run(chiArr) {
    if (resData.length !== 0) {
      for (let i = 0; i < chiArr.length; i++) {
        for (let j = 0; j < resData.length; j++) {
          if (chiArr[i].id === resData[j][attributes.parentId]) {
            let obj = {
              id: resData[j][attributes.id],
              title: resData[j][attributes.name],
              children: []
            };
            chiArr[i].children.push(obj);
            resData.splice(j, 1);
            j--;
          }
        }
        run(chiArr[i].children);
      }
    }
  }
  return tree;
}
let allRes = [
  {
    resourcesId: 4,
    resName: "删除角色",
    resParentId: 2
  },
  {
    resourcesId: 3,
    resName: "编辑角色",
    resParentId: 1
  },

  {
    resourcesId: 2,
    resName: "设置权限",
    resParentId: 1
  },
  {
    resourcesId: 5,
    resName: "添加用户",
    resParentId: 4
  },
  {
    resourcesId: 6,
    resName: "更新用户",
    resParentId: 4
  },
  {
    resourcesId: 7,
    resName: "删除用户",
    resParentId: 6
  },
  {
    resourcesId: 8,
    resName: "重置密码",
    resParentId: 3
  },
  {
    resourcesId: 9,
    resName: "添加地区",
    resParentId: 5
  },
  {
    resourcesId: 10,
    resName: "编辑地区",
    resParentId: 6
  },
  {
    resourcesId: 11,
    resName: "产品",
    resParentId: 1
  }
];

let data = allRes;
// 属性配置信息
let attributes = {
  id: 'resourcesId',
  parentId: 'resParentId',
  name: 'resName',
  rootId: 1
};
// let treeData = toTreeData(data, attributes);
// console.log(JSON.stringify(treeData, '', '\t'))




function toTree(source, id, parentId, children) {
  let cloneData = JSON.parse(JSON.stringify(source))
  return cloneData.filter(father => {
    let branchArr = cloneData.filter(child => father[id] == child[parentId]);
    branchArr.length > 0 ? father[children] = branchArr : ''
    return father[parentId] == 1        // 如果第一层不是parentId=0，请自行修改
  })
}
let res = toTree(data, 'resourcesId', 'resParentId', 'children')
console.log("res: ", JSON.stringify(res, ' ', '\t'))


function setTreeData(source) {
  let cloneData = JSON.parse(JSON.stringify(source))      // 对源数据深度克隆
  return cloneData.filter(father => {                      // 循环所有项，并添加children属性
    let branchArr = cloneData.filter(child => father.id == child.parentId);   // 返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : ''   //给父级添加一个children属性，并赋值
    return father.parentId == 0;      //返回第一层
  });
}
