class Material {
    constructor(name, elasticity, foo) {
        this.name = name;
        this.elasticity = elasticity;
        this.foo = foo;
    }
}

class Units {
	constructor(name, lengthText, lengthMult, pressureText, pressureMult, unitList) {
		this.name = name;
		this.lengthText = lengthText;
		this.lengthMult = lengthMult;
		this.pressureText = pressureText;
		this.pressureMult = pressureMult;
		this.unitList = unitList;
	}
}

// Setup Materials and their Young's Modulus of Elasticities (GPa), ultimate tensile strength (MPa), and other material properties
const materials = {
  'Aluminum': new Material('Aluminum', 69, 110),
  'Steel': new Material('Steel', 180, 860),
  'Copper': new Material('Copper', 117, 220),
};

// Setup units - multiplier between Metric and Imperial
const UnitChoice = {
	'Metric': new Units('Metric',' m', 1,' GPa', 1, 'm / GPa / kgs'),
	'Imperial': new Units('Imperial',' in', 39.37,' kpsi', 145.038, 'inch / kpsi / lbs'),
};

var BeamPicNum;


function calculateFoo(elasticity, radius) {
  return elasticity * radius;
}

$(document).ready(function() {
    var materials_select = document.getElementById("MaterialSelect");
	//var materials_Modulus = document.getElementById("YM_Display");
	var unit_select = document.getElementById("UnitSelect");
	
	// Setup Unit input
    for (let unitKey in UnitChoice) {
        var unit = UnitChoice[unitKey];

        var el = document.createElement("option");
        el.textContent = unit.name;
        el.value = unit.name;
        unit_select.appendChild(el);
    }
	
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
		alert(calculateFoo(material.elasticity, radiusValue));
		
		// Will change BeamPicture based on final direction of forces
		// Need to set BeamPicNum above
		/*
		var BeamChange = $("#BeamPic");
		BeamChange.attr('src', 'BeamPic' + BeamPicNum + '.png');
        */
		
			
    });
	
	
	// Updates Youngs Modulus on change of Material and Unit Choice
	$("#MaterialSelect, #UnitSelect").change(function() {
		var text1 = $("#MaterialSelect option:selected").text();
		var text2 = $("#UnitSelect option:selected").text();
		var elas = parseInt(materials[text1].elasticity * UnitChoice[text2].pressureMult);
		$("#ElasticityDisplay").text(elas + UnitChoice[text2].pressureText);
		$("#UnitDisplay").text(UnitChoice[text2].unitList);
	});
	
	
	// Updates Radius or Height/Width request on Circular or Rectangular radio select
	
	
});


	


        //alert(calculateFoo(material.elasticity, radiusValue));
        //document.getElementById("ElasticityDisplay").innerHTML = material.elasticity;
