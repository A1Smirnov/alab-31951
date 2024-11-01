// ./warm-up/algos.js

// 1. Find the Length of Each String in an Array
// Problem: Write a function getLengths(arr) that takes an array of strings and returns an array of their lengths.
// Example:
// getLengths([“hello”, “world”, “hi”]); // [5, 5, 2]
// Hint: Use map() and the length property
function getLengths(arr) {
  // const final = [];

  // for (let i = 0; i < arr.length; i++) {
  //   final.push(arr[i].length)
  // }

  // return final

  return arr.map(str => str.length)
}

// console.log("Question 1: ", getLengths(["hello", "world", "hi"]))

// 2. Square Each Number in an Array
// Problem: Write a function squareArray(arr) that takes an array of numbers and returns a new array with each number squared.
// Example:
// squareArray([1, 2, 3]); // [1, 4, 9]
// Hint: Use the map() method.

function squareArray(arr) {
  return arr.map(num => num ** 2)
}

// console.log("Question 2: ", squareArray([1, 2, 3]))

// 3. Find the Minimum Number in an Array
// Problem: Write a function findMin(arr) that takes an array of numbers and returns the smallest number in the array.
// Example:
// findMin([4, 1, 9, 7, 3]); // 1
// Hint: Use a loop to compare each number. Do NOT use Math.min()

function findMin(arr) {
  // let min = arr[0];

  // for (let i = 1; i < arr.length; i++) {
  //   if (arr[i] < min) {
  //     min = arr[i]
  //   }
  // }

  // return min

  return arr.sort((a, b) => a - b)[0]
}

console.log("Question 3: ", findMin([14, 11,15, 10, 900, 74, 3.5]))


// 4. Remove Duplicates from an Array
// Problem: Write a function removeDuplicates(arr) that takes an array and returns a new array with only unique values.
// Example:
// removeDuplicates([1, 2, 2, 3, 4, 4]); // [1, 2, 3, 4]
// Hint: Try using a Set to handle uniqueness, or loop through and add values to a result array only if they’re not already present. 
function removeDuplicates(arr) {
  return arr.reduce((acc, num) => {
    if (!acc.includes(num)) {
      acc.push(num)
    }
    return acc
  }, [])

  // const set = new Set(arr)

  // return [...set]
}

console.time("removeDupsTime")
console.log("Question 4: ", removeDuplicates([1, 2, 2, 3, 4, 4]))
console.timeEnd("removeDupsTime")