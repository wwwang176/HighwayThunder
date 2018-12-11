//https://github.com/mrdoob/three.js/issues/14223

function DeepClone(Object)
{
    var NewObject=Object.clone();

    NewObject.traverse(function(node){
        if (node.isMesh) {
            node.material = node.material.clone();
        }
    });

    return NewObject;
}