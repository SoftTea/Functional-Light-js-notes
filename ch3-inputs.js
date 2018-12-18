// // SUMMARY 
// //Partial application is a technique for reducing the arity (that is, the expected number of arguments to a function) by creating a new function where some of the arguments are preset.

// Currying is a special form of partial application where the arity is reduced to 1, with a chain of successive chained function calls, each which takes one argument. Once all arguments have been specified by these function calls, the original function is executed with all the collected arguments. You can also undo a currying.

// Other important utilities like unary(..), identity(..), and constant(..) are part of the base toolbox for FP.

// Point-free is a style of writing code that eliminates unnecessary verbosity of mapping parameters ("points") to arguments, with the goal of making code easier to read/understand.

// All of these techniques twist functions around so they can work together more naturally. With your functions shaped compatibly now, the next chapter will teach you how to combine them to model the flows of data through your program.


/////////////////////////////////////////////////////////

//All for One -- helper function to transfer multiple arguments to a function which we only want 1 argument.
// changing fn into a unary - single parameter function 

function unary(fn) {
    return function onlyOneArg(arg){
        return fn( arg );
    };
}

//////// 
// parseInt signature == parseInt(str,radix)
["1","2","3"].map( parseInt );
// [1,NaN,NaN]

// unary(..) creates a function that will ignore all but the first argument passed to it, meaning the passed-in index is never received by parseInt(..) and mistaken as the radix:

["1","2","3"].map( unary( parseInt ) );
// [1,2,3]


// Identity function 

function identity(v) {
    return v;
}


// common use of identity function is as a default function instead of a function transformation 

function output(msg,formatFn = identity) {
    msg = formatFn( msg );
    console.log( msg );
}

function upper(txt) {
    return txt.toUpperCase();
}

output( "Hello World", upper );     // HELLO WORLD
output( "Hello World" );            // Hello World


// Constant function  -- Unchanging One 

function constant(v) {
    return function value(){
        return v;
    };
}

p1.then( foo ).then( constant( p2 ) ).then( bar );

// Adapting Arguments to Parameters //

// often called apply() in Functional libraries

function spreadArgs(fn) {
    return function spreadFn(argsArr){
        return fn( ...argsArr );
    };
}

// unapply() or gatherArgs

function gatherArgs(fn) {
    return function gatheredFn(...argsArr){
        return fn( argsArr );
    };
}

// Ex. of  gatherArgs()

function combineFirstTwo([ v1, v2 ]) {
    return v1 + v2;
}

[1,2,3,4,5].reduce( gatherArgs( combineFirstTwo ) );
// 15


// Partials --- Some Now, Some Later 
// Partials are the preferred tool of FP for partially applying arguments, but .bind() can partially apply arguments as well.

var getPerson = ajax.bind( null, "http://some.api/person" );

===

var getPerson = partial(ajax, 'http://some.api/person');



function partial(fn,...presetArgs) {
    return function partiallyApplied(...laterArgs){
        return fn( ...presetArgs, ...laterArgs );
    };
}

function add(x,y) {
    return x + y;
}

[1,2,3,4,5].map( function adder(val){
    return add( 3, val );
} );
// [4,5,6,7,8]

[1,2,3,4,5].map( partial( add, 3 ) );
// [4,5,6,7,8]


// Reversing Arguments


function reverseArgs(fn) {
    return function argsReversed(...args){
        return fn( ...args.reverse() );
    };
}

/// 

var cache = {};

var cacheResult = reverseArgs(
    partial( reverseArgs( ajax ), function onResult(obj){
        cache[obj.id] = obj;
    } )
);

// later:
cacheResult( "http://some.api/person", { user: CURRENT_USER_ID } );


///////////////////////////////////////////////////////
/// SAME 
function partialRight(fn,...presetArgs) {
    return reverseArgs(
        partial( reverseArgs( fn ), ...presetArgs.reverse() )
    );
}

var cacheResult = partialRight( ajax, function onResult(obj){
    cache[obj.id] = obj;
});

// later:
cacheResult( "http://some.api/person", { user: CURRENT_USER_ID } );

/////// Same More Straight forward 

function partialRight(fn,...presetArgs) {
    return function partiallyApplied(...laterArgs){
        return fn( ...laterArgs, ...presetArgs );
    };
}

function foo(x,y,z,...rest) {
    console.log( x, y, z, rest );
}

var f = partialRight( foo, "z:last" );

f( 1, 2 );          // 1 2 "z:last" []

f( 1 );             // 1 "z:last" undefined []

f( 1, 2, 3 );       // 1 2 3 ["z:last"]

f( 1, 2, 3, 4 );    // 1 2 3 [4,"z:last"]

//---------------------------------------------------------//
// Currying //

// Example of a curry-ifying function 

// 
function curry(fn,arity = fn.length) {
    return (function nextCurried(prevArgs){
        return function curried(nextArg){
            var args = [ ...prevArgs, nextArg ];

            if (args.length >= arity) {
                return fn( ...args );
            }
            else {
                return nextCurried( args );
            }
        };
    })( [] );
}


function sum(...nums) {
    var total = 0;
    for (let num of nums) {
        total += num;
    }
    return total;
}

sum( 1, 2, 3, 4, 5 );                       // 15

// now with currying:
// (5 to indicate how many we should wait for)
var curriedSum = curry( sum, 5 );

curriedSum( 1 )( 2 )( 3 )( 4 )( 5 );        // 15

// This function named looseCurry , curry's a function for us (like our previous Currying function), yet now accepts multiple arguments from individual function calls.

function looseCurry(fn,arity = fn.length) {
    return (function nextCurried(prevArgs){
        return function curried(...nextArgs){ // rest paramter syntax 
            var args = [ ...prevArgs, ...nextArgs ];

            if (args.length >= arity) {
                return fn( ...args );
            }
            else {
                return nextCurried( args );
            }
        };
    })( [] );
}

var curriedSum = looseCurry( sum, 5 );

curriedSum( 1 )( 2, 3 )( 4, 5 );   

// A Naive implementation of an uncurry function: 

function uncurry(fn) {
    return function uncurried(...args){
        var ret = fn;

        for (let arg of args) {
            ret = ret( arg );
        }

        return ret;
    };
}

// What if we have function which is using a 'Named arguments pattern'? (ie the parameter definition for the function being curried is, an {} )
// example of functions which solve this:

function partialProps(fn,presetArgsObj) {
    return function partiallyApplied(laterArgsObj){
        return fn( Object.assign( {}, presetArgsObj, laterArgsObj ) );
    };
}

function curryProps(fn,arity = 1) {
    return (function nextCurried(prevArgsObj){
        return function curried(nextArgObj = {}){
            var [key] = Object.keys( nextArgObj );
            var allArgsObj = Object.assign(
                {}, prevArgsObj, { [key]: nextArgObj[key] }
            );

            if (Object.keys( allArgsObj ).length >= arity) {
                return fn( allArgsObj );
            }
            else {
                return nextCurried( allArgsObj );
            }
        };
    })( {} );
}

function foo({ x, y, z } = {}) {
    console.log( `x:${x} y:${y} z:${z}` );
}

var f1 = curryProps( foo, 3 );
var f2 = partialProps( foo, { y: 2 } );

f1( {y: 2} )( {x: 1} )( {z: 3} );
// x:1 y:2 z:3

f2( { z: 3, x: 1 } );
// x:1 y:2 z:3

//  Is is important because it allows our curried and partial functions the ability to take arguments out of order, because named argument patterns, without needing to use utilies like reverseArgs(...) multiple times

// What if the function we would like to curry using Named arguments pattern is already defined with non-desctured parameters? 
// We will need to have a utily which will take these kinda of functions and take their parameters place them into an object 

function spreadArgProps(
    fn,
    propOrder =
        fn.toString()
        .replace( /^(?:(?:function.*\(([^]*?)\))|(?:([^\(\)]+?)
            \s*=>)|(?:\(([^]*?)\)\s*=>))[^]+$/, "$1$2$3" )
        .split( /\s*,\s*/ )
        .map( v => v.replace( /[=\s].*$/, "" ) )
) {
    return function spreadFn(argsObj){
        return fn( ...propOrder.map( k => argsObj[k] ) );
    };
}



// No Points -- style of FP programing which aims to reduce unnecessary parameter- argument mapping.

// Formally called 'tacit programming '-- or Point Free Style 

// Simple example:

function double(x) {
    return x * 2;
}

[1,2,3,4,5].map( function mapper(v){
    return double( v );
} );
// [2,4,6,8,10]

// We see here that mapper(...) is unnecessary

// Point free style: 

function double(x) {
    return x * 2;
}

[1,2,3,4,5].map( double );
// [2,4,6,8,10]

// Early example : 

["1","2","3"].map( function mapper(v){
    return parseInt( v );
} );
// [1,2,3]

// this function wrapper is necessary as it removes the extra paramters which the map() passes in 

// Using a utility function unary(); we can make the style point free:

// ["1","2","3"].map( unary( parseInt ) );
// // [1,2,3]

//** The last example hurts my head right now.. just putting it in to go over again latter.  */

function not(predicate) {
    return function negated(...args){
        return !predicate( ...args );
    };
}

function when(predicate,fn) {
    return function conditional(...args){
        if (predicate( ...args )) {
            return fn( ...args );
        }
    };
}

function output(msg) {
    console.log( msg );
}

function isShortEnough(str) {
    return str.length <= 5;
}

var isLongEnough = not( isShortEnough );

var printIf = uncurry( partialRight( when, output ) );

var msg1 = "Hello";
var msg2 = msg1 + " World";

printIf( isShortEnough, msg1 );         // Hello
printIf( isShortEnough, msg2 );

printIf( isLongEnough, msg1 );
printIf( isLongEnough, msg2 );          // Hello World