// This file has ESLint violations our hooks should catch

// no-unused-vars violation
const unusedVariable = "I'm never used";
let anotherUnused = 42;

// no-undef violation (using undefined variable)
function useUndefined() {
  console.log(undefinedVariable); // This variable doesn't exist
  return someGlobalThatDoesntExist;
}

// prefer-const violation (should use const)
let shouldBeConst = "This never changes";
let neverReassigned = { prop: "value" };

// no-explicit-any violation
function acceptsAny(param: any): any {
  return param;
}

const anyTypedVar: any = "could be anything";

// Multiple violations in one function
function problematicFunction() {
  let unusedInFunction = "unused";
  console.log(anotherUndefinedVar);
  let shouldAlsoBeConst = 123;
  return shouldAlsoBeConst;
}
