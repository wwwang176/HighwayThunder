function TrafficCone(iConfig)
{
    var Config={
        Mass:1,
        Position:new THREE.Vector3(0,0,0),
        OnRunCallBack:function(){},
        RunCallBack:function(){}
    };
    Config=$.extend(Config,iConfig);

    //繼承Package
    this.prototype=Object.create(Package.prototype);
    Package.call(this,Config);

    this.BodySize=new CANNON.Vec3(0.5,0.5,1);

    var cylinderShape = new CANNON.Cylinder(0.05,0.5,1,4);
    this.Body.addShape(cylinderShape);

    //L0
    this.L0Group=new THREE.Group();
    var geometry = new THREE.CylinderBufferGeometry(0.05,0.2,1,5,1,false);
    var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    var verticalCylinder = new THREE.Mesh( geometry, material );
    verticalCylinder.rotation.x=90*Math.PI/180;
    this.L0Group.add(verticalCylinder);

    var geometry = new THREE.BoxBufferGeometry(0.5,0.5,0.1);
    var material = new THREE.MeshPhongMaterial( {color: 0xff0000,side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    plane.position.z=-1/2;
    this.L0Group.add(plane);
    
    this.LOD.addLevel(this.L0Group,0);

    //L1
    var geometry = new THREE.CylinderBufferGeometry(0.05,0.2,1,3,1,false);
    var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    var verticalCylinder = new THREE.Mesh( geometry, material );
    verticalCylinder.rotation.x=90*Math.PI/180;
    this.LOD.addLevel(verticalCylinder,75);

    
}

function PutTrafficCone()
{
    for(var i=0;i<AllTrafficCone.length;i++)
    {
        AllTrafficCone[i].Reset();
        AllTrafficCone[i].Body.position.x=-400+10+(i*5);
        AllTrafficCone[i].Body.position.y=11.5 + (3/15)*i;
        AllTrafficCone[i].Body.position.z=1;
    }
}