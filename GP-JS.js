class Material {
    constructor(name, elasticity, foo) {
        this.name = name;
        this.elasticity = elasticity;
        this.foo = foo;
    }
}

// Setup Materials and their Young's Modulus of Elasticities, ultimate tensile strength, and other material properties
const materials = {
  'Aluminum': new Material('Aluminum', 69*Math.pow(10,9), 110*Math.pow(10,6)),
  'Steel': new Material('Steel', 180*Math.pow(10,9), 860*Math.pow(10,6)),
  'Copper': new Material('Copper', 117*Math.pow(10,9), 220*Math.pow(10,6)),
};

var BeamPicNum;



function calculateFoo(elasticity, radius) {
  return elasticity * radius;
}

$(document).ready(function() {
    var materials_select = document.getElementById("MaterialSelect");
	//var materials_Modulus = document.getElementById("YM_Display");
    var material_objs = {};

    // Setup material input
    for (let materialKey in materials) {
        var material = materials[materialKey];

        var el = document.createElement("option");
        el.textContent = material.name;
        el.value = material.name;
        materials_select.appendChild(el);
    }

    // Setup units input...
    //
    /*
     *
     * ﻿
     * $('#CrossSectionRadius')
     * S.fn.init [input#CrossSectionRadius]
     * const someElement = $('#CrossSectionRadius')
     * undefined
     * someElement
     * S.fn.init [input#CrossSectionRadius]
     * someElement.attr('src', 'foo.svg')
     * S.fn.init [input#CrossSectionRadius]
     */
    

    $("#submit1").click(function(e) {
        var text = $("#MaterialSelect option:selected").text();
        const material = materials[text]; 

        // Read cross section radius
        const radiusInput = $('#CrossSectionRadius');
        const radiusValue = parseFloat(radiusInput.val());

		
        // Calculate foo
		
		
		// Will change BeamPicture based on final direction of forces
		// Need to set BeamPicNum above
		/*
		var BeamChange = $("#BeamPic");
		BeamChange.attr('src', 'BeamPic' + BeamPicNum + '.png');
        */
		
			
    });
	
	
	// Updates Youngs Modulus on change of Material
	$("#MaterialSelect").change(function() {
		var text1 = $("#MaterialSelect option:selected").text();
		$("#ElasticityDisplay").text(materials[text1].elasticity);
	});
	
	
	// Updates Radius or Height/Width request on Circular or Rectangular radio select
	
	
});


	
// Setup units - multiplier between Metric and Imperial
const unitsChoice = {
	'mm': new Units1('mm', 0.001, 1, 1),
	'in': new Units1('in', 25.4, 6894.76, 4.45),
};

        //alert(calculateFoo(material.elasticity, radiusValue));
        //document.getElementById("ElasticityDisplay").innerHTML = material.elasticity;
