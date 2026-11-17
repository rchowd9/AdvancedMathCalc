function unaryRelation(set, predicate) {

    return set.filter(predicate);
}

function nAryRelation(...sets) {
 
let relation = [[]];
 
for (const set of sets) {
 
const temp = [];
 
for (const tuple of relation) {
 
for (const element of set) {
temp.push([
...tuple,
element
]);
}
}
 
relation = temp;
}
 
return relation;
}

function funcRelation()
{
    
}

function universalQuantifier()
{
    
}

function existentialQuantifier()
{
    
}
