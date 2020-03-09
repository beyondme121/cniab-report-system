let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let test = [3, 5, 6]

for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < test.length; j++) {
    if (arr[i] === test[j]) {
      arr.splice(i, 1)
    }
  }
}
console.log(arr)

// let a = arr.filter(item => false)
// console.log("a: ", a)

// let new_arr = arr.filter(item => {
//   return test.(t => {
//     console.log(item !== t)
//     return item !== t
//   })
// })
// console.log(new_arr)