//Première fonction

// function findhighestOccurenceAndNum(a){
//     let obj={};
//     let maxNum;
//     let maxVal;
//     for(let v of a){
//         obj[v]= ++obj[v] ||1;
//         if(maxVal === undefined || obj[v]> maxVal){
//             maxNum= v;
//             maxVal=obj[v];
//         }
//     }
//     console.log(maxNum + ' has max value = ', maxVal);
// }

// findhighestOccurenceAndNum([1,1,1,2,2,2,2])

//Deuxième fonction

// const highest = arr => (arr || []).reduce( ( acc, el ) => {
//     acc.k[el] = acc.k[el] ? acc.k[el] + 1 : 1
//     acc.max = acc.max ? acc.max < acc.k[el] ? el : acc.max : el
//     return acc  
//   }, { k:{} }).max
  
//   const test = [1,1,1,2,2,2,1,2,2]
//   console.log(highest(test))

//Fonction la troisième (réfère la 2 ème)
// var array = [1, 3, 6, 6, 6, 6, 7, 7, 12, 12, 17, 12, 12, 12],
//     c = {}, // counters
//     s = []; // sortable array

// for (var i=0; i<array.length; i++) {
//     c[array[i]] = c[array[i]] || 0; // initialize
//     c[array[i]]++;
// } // count occurrences

// for (var key in c) {
//     s.push([key, c[key]])
// } // build sortable array from counters

// s.sort(function(a, b) {return b[1]-a[1];});

// var firstMode = s[0][0];
// console.log(firstMode);


//function quatrème nice
// var arr = [1,3,54,56,6,6,1,6,6];
// var obj = {};

// /* first convert the array in to object with unique elements and number of times each element is repeated */
// for(var i = 0; i < arr.length; i++)
// {
//    var x = arr[i];
//    if(!obj[x])
//      obj[x] = 1;
//    else 
//      obj[x]++;
// }

// console.log(obj);//just for reference

// /* now traverse the object to get the element */
// var index = 0;
// var max = 0;

// for(var obIndex in obj)
// {
//   if(obj[obIndex] > max)
//   {
//     max = obj[obIndex];
//     index = obIndex;
//   }
// }
// console.log(index+" got maximum time repeated, with "+ max +" times" );