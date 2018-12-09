// These are notes from Functional Light Js from @getify (Kyle Simpson)

//2


// Rest operators - spread used in function decleration -- gathers values into an Array.
function foo(x,y,z,...args) {
    console.log( x, y, z, args );
}

foo();                  // undefined undefined undefined []
foo( 1, 2, 3 );         // 1 2 3 []
foo( 1, 2, 3, 4 );      // 1 2 3 [ 4 ]
foo( 1, 2, 3, 4, 5 );   // 1 2 3 [ 4, 5 ]


// Rest operator in function definition with spread operator in function call.

// function def - gather parameters
// function call - spreads paramters

function foo(...args) { 
    // args === [1,2,3,4,5]
    console.log( args[3] );
}

var arr = [ 1, 2, 3, 4, 5 ];

foo( ...arr );  // === foo (1,2,3,4,5)  


// Parameter Destructuring

//destructuring tells the engine that an array is expected in this assignment position (aka parameter). The pattern says to take the first value of that array and assign to a local parameter variable called x, the second to y, and whatever is left is gathered into args.

function foo( [x,y,...args] = [] ) {
    // ..
    
}

foo( [1,2,3] ); // x = 1
                //  y = 2
                // args = [3]

// Named Arguments 
// Destructuring object parameters


function foo( {x,y} = {} ) {
    console.log( x, y );
}

foo( {y: 3} );   // ==> undefined , 3        
foo( {y: 3 , x : 1} );   // ==> 1 , 3 

// Explicit Outputs vs Implicit output

// Example of implicit output 

var y;

function f(x) {
    y = (2 * Math.pow( x, 2 )) + 3;
}

f( 2 );

y;                      // 11


// explicit output 

function f(x) {
    return (2 * Math.pow( x, 2 )) + 3;
}

var y = f( 2 );

y;  

// Another example of implicit output 
//This implicit function output has a special name in the FP world: side effects. 
// And a function that has no side effects also has a special name: pure function.

function sum(list) {
    var total = 0;
    for (let i = 0; i < list.length; i++) {
        if (!list[i]) list[i] = 0;

        total = total + list[i];
    }

    return total;
}

var nums = [ 1, 3, 9, 27, , 84 ];

sum( nums );           // 124
// Our function sum() implicit output of changing out num variable 
console.log(nums); // === [ 1, 3, 9, 27, 0, 84];

// Keeping Scope


function person(name) {
    return function identify(){
        console.log( `I am ${name}` );
    };
}

var fred = person( "Fred" );
var susan = person( "Susan" );

fred();                 // I am Fred
susan();                // I am Susan


function formatter(formatFn) {
    return function inner(str){
        return formatFn( str );
    };
}

///////////////////////////////////////////////////////////////////////////////
var lower = formatter( function formatting(v){
    return v.toLowerCase();
} );

var upperFirst = formatter( function formatting(v){
    return v[0].toUpperCase() + v.substr( 1 ).toLowerCase();
} );

lower( "WOW" );             // wow
upperFirst( "hello" );      // Hello


