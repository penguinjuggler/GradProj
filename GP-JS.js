class Material {
    constructor(name, elasticity, foo) {
        this.name = name;
        this.elasticity = elasticity;
        this.foo = foo;
    }
}

const materials = {
  'Aluminum': new Material('Aluminum', 1, 4),
  'Steel': new Material('Steel', 2, 5),
};

function calculateFoo(elasticity, radius) {
  return elasticity * radius;
}

$(document).ready(function() {
    var materials_select = document.getElementById("materials");
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
        var text = $("#materials option:selected").text();
        const material = materials[text]; 

        // Read cross section radius
        const radiusInput = $('#CrossSectionRadius');
        const radiusValue = parseFloat(radiusInput.val());

        // Calculate foo
        alert(calculateFoo(material.elasticity, radiusValue));
        
        // Calculate baz
    });
});



