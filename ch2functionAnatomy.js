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